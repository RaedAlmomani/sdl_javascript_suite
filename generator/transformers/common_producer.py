"""
Common transformation
"""

import logging
import re
import textwrap
from abc import ABC, abstractmethod
from collections import namedtuple, OrderedDict
from pathlib import Path

from model.array import Array
from model.enum import Enum
from model.float import Float
from model.function import Function
from model.integer import Integer
from model.struct import Struct
from transformers.generate_error import GenerateError


class InterfaceProducerCommon(ABC):
    """
    Common transformation
    """

    def __init__(self, enums_dir_name, structs_dir_name,
                 names=(), mapping=OrderedDict(), key_words=()):
        self.logger = logging.getLogger(self.__class__.__name__)
        self.names = [self.replace_sync(e) for e in names]
        self.enums_dir = enums_dir_name
        self.structs_dir = structs_dir_name
        self.mapping = mapping
        self.key_words = key_words
        self.imports = namedtuple('Imports', 'what wherefrom')
        self.methods = namedtuple('Methods', 'key method_title external description param_name param_values type deprecated history since')
        self.params = namedtuple('Params', 'key value')

    @property
    @abstractmethod
    def container_name(self):
        """
        Forced to be implemented in child classes
        :return: container name for particular issue type
        """
        pass

    def replace_keywords(self, name):
        """
        if :param name in self.key_words, :return: name += 'Param'
        :param name: string with item name
        """
        if any(map(lambda k: re.search(r'^(get|set|key_)?{}$'.format(name.casefold()), k), self.key_words)):
            origin = name
            if name.isupper():
                name += '_PARAM'
            else:
                name += 'Param'
            self.logger.debug('Replacing %s with %s', origin, name)
        return self.replace_sync(name)

    @staticmethod
    def capitalize(name):
        """
        :param name: string with item name
        :return:
        """
        return name[:1].upper() + name[1:]

    @staticmethod
    def extract_values(param):
        p = OrderedDict() 
        if hasattr(param.param_type, 'min_size'):
            p['array_min_size'] = param.param_type.min_size  
        if hasattr(param.param_type, 'max_size'):
            p['array_max_size'] = param.param_type.max_size 
        if hasattr(param, 'default_value'):
            if hasattr(param.default_value, 'name'):
                p['default_value'] = param.default_value.name
            else:
                p['default_value'] = param.default_value
        elif hasattr(param.param_type, 'default_value'):
            if hasattr(param.param_type.default_value, 'name'):
                p['default_value'] = param.param_type.default_value.name
            else:  
                p['default_value'] = param.param_type.default_value
        if hasattr(param.param_type, 'min_value'):
            p['num_min_value'] = param.param_type.min_value
        elif hasattr(param.param_type, 'element_type') and hasattr(param.param_type.element_type, 'min_value'):
            p['num_min_value'] = param.param_type.element_type.min_value
        if hasattr(param.param_type, 'max_value'):
            p['num_max_value'] = param.param_type.max_value
        elif hasattr(param.param_type, 'element_type') and hasattr(param.param_type.element_type, 'max_value'):
            p['num_max_value'] = param.param_type.element_type.max_value
        if hasattr(param.param_type, 'min_length'):
            p['string_min_length'] = param.param_type.min_length
        elif hasattr(param.param_type, 'element_type') and hasattr(param.param_type.element_type, 'min_length'):
            p['string_min_length'] = param.param_type.element_type.min_length
        if hasattr(param.param_type, 'max_length'):
            p['string_max_length'] = param.param_type.max_length
        elif hasattr(param.param_type, 'element_type') and hasattr(param.param_type.element_type, 'max_length'):
            p['string_max_length'] = param.param_type.element_type.max_length

        # Filter None values
        filtered_values = {k: v for k, v in p.items() if v is not None}
        return filtered_values

    @staticmethod
    def replace_sync(name):
        """
        :param name: string with item name
        :return: string with replaced 'sync' to 'Sdl'
        """
        if name:
            name = re.sub(r'^([sS])ync(.+)$', r'\1dl\2', name)
        return name

    def transform(self, item) -> dict:
        """
        :param item: particular element from initial Model
        :return: dictionary to be applied to jinja2 template
        """
        imports = OrderedDict()
        methods = OrderedDict()
        params = OrderedDict()

        for param in getattr(item, self.container_name).values():
            _import, _methods, _params = self.common_flow(param, type(item))
            if _import:
                imports.update(_import)
            if _methods:
                methods[param.name] = _methods
            params[param.name] = _params

        name = self.replace_sync(item.name)
        name = self.capitalize(name)
        render = OrderedDict()
        render['file_name'] = name
        render['name'] = name
        render['imports'] = {self.imports(what=k, wherefrom=v) for k, v in imports.items()}
        render['methods'] = methods
        render['params'] = params

        if getattr(item, 'description', None):
            render['description'] = self.extract_description(item.description)
        if item.deprecated:
            render['deprecated'] = item.deprecated
        if item.history:
            render['history'] = item.history
        if item.since:
            render['since'] = item.since

        self.custom_mapping(render, item)

        render['params'] = tuple(render['params'].values())
        render['methods'] = tuple(render['methods'].values())

        return render

    def extract_imports(self, param, item_type):
        """
        :param param:
        :param item_type:
        :return:
        """

        def evaluate(element):
            if isinstance(element, (Struct, Enum)):
                return self.replace_sync(element.name), type(element)
            return None, None

        if isinstance(param.param_type, Array):
            type_origin, kind = evaluate(param.param_type.element_type)
        else:
            type_origin, kind = evaluate(param.param_type)

        if type_origin in self.names:
            if kind is Enum:
                return {type_origin: '{}/{}.js'.format(self.enums_dir, type_origin)}
            elif kind is Struct:
                if item_type is Struct:
                    import_path = '.'
                else:
                    import_path = self.structs_dir
                return {type_origin: '{}/{}.js'.format(import_path, type_origin)}

    def common_flow(self, param, item_type):
        """
        Main transformation flow, for Struct and Function
        :param param: sub-element (Param, FunctionParam) of element from initial Model
        :param item_type: type of parent element from initial Model
        :return: tuple with 3 element, which going to be applied to jinja2 template
        """
        name, description = self.extract_name_description(param)
        type_name = self.extract_type(param)
        imports = self.extract_imports(param, item_type)
        param_name = self.replace_sync(param.name)

        short_name = re.sub(r'(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', '=^.^=', param_name) \
            .split('=^.^=').pop().lower()
        description = self.extract_description(description)

        key = self.key(param_name)
        key = self.replace_keywords(key)

        param_values = self.extract_values(param)

        title = self.replace_keywords(param_name)
        title = self.capitalize(title)

        deprecated = param.deprecated
        history = param.history
        since = param.since

        methods = self.methods(key=key, method_title=title, external=name, description=description,
                               param_name=short_name, param_values=param_values, type=type_name, 
                               deprecated=deprecated, history=history, since=since)
        params = self.params(key=key, value="'{}'".format(param.name))
        return imports, methods, params

    def prepare_imports(self, extend):
        """
        Extract imports from property PATH_TO_(STRUCT|REQUEST|RESPONSE|NOTIFICATION)_CLASS
        :param extend: property to be evaluated and converted to self.imports
        :return: self.imports
        """
        tmp = re.match(r'.+/(.+).js', extend)
        if tmp:
            return self.imports(what=tmp.group(1), wherefrom=extend)
        raise GenerateError('Can not extract imports from {}'.format(extend))

    @staticmethod
    def key(param: str):
        """
        Convert param string to uppercase and inserting underscores
        :param param: camel case string
        :return: string in uppercase with underscores
        """
        if re.match(r'^[A-Z_]+$', param):
            return 'KEY_' + param
        return 'KEY_' + re.sub(r'([a-z]|[A-Z]{2,})([A-Z]|\d$)', r'\1_\2', param).upper()

    @staticmethod
    def ending_cutter(name: str):
        """
        If string not contains only uppercase letters and end with 'ID' deleting 'ID' from end of string
        :param name: string to evaluate and deleting 'ID' from end of string
        :return: if match cut string else original string
        """
        if name.endswith('ID') and re.match(r'^(?=\w+[A-Z])(?=\w+[a-z])\w+$', name):
            return name[:-2]
        return name

    @staticmethod
    def extract_description(data, length: int = 2048) -> list:
        """
        Extract description
        :param data: list with description
        :param length:
        :return: evaluated string
        """
        if not data:
            return []
        if isinstance(data, list):
            data = ' '.join(data)
        return textwrap.wrap(re.sub(r'(\s{2,}|\n)', ' ', data).strip(), length)

    def extract_name_description(self, param):
        """
        Extracting and evaluating name, description from appropriate place
        :param param: sub-element (Param, FunctionParam) of element from initial Model
        :return: tuple with 2 element (name, description)
        """
        name = None
        description = None
        if getattr(param, 'description', None):
            description = param.description

        if getattr(param, 'primary_name', None):
            name = param.primary_name
        elif getattr(param, 'param_type', None):
            if getattr(param.param_type, 'name', None):
                name = param.param_type.name
                if not description and getattr(param.param_type, 'description', None):
                    description = param.param_type.description
            elif getattr(param.param_type, 'element_type', None) and \
                    getattr(param.param_type.element_type, 'name', None):
                name = param.param_type.element_type.name
                if not description and getattr(param.param_type.element_type, 'description', None):
                    description = param.param_type.element_type.description

        return self.replace_sync(name), self.extract_description(description)

    def extract_type(self, param):
        """
        Evaluate and extract type
        :param param: sub-element (Param, FunctionParam) of element from initial Model
        :return: string with sub-element type
        """

        def evaluate(instance):
            if isinstance(instance, (Struct, Enum)):
                return instance.name
            if isinstance(instance, (Integer, Float)):
                return 'Number'
            return type(instance).__name__

        if isinstance(param.param_type, Array):
            return self.replace_sync(evaluate(param.param_type.element_type)) + '[]'
        return self.replace_sync(evaluate(param.param_type))

    def get_file_content(self, file_name: str):
        """
        Used for getting content of custom scripts used in custom mapping
        :param file_name: relational path custom scripts
        :return: string with content of custom scripts
        """
        file_name = Path(__file__).absolute().parents[1].joinpath(file_name)
        try:
            with file_name.open('r') as file:
                intermediate = file.readlines()
            return ''.join(intermediate)
        except FileNotFoundError as message:
            self.logger.error(message)
            return ''

    def custom_mapping(self, render, item):
        """
        :param render: dictionarry with data ready to apply to Jinja2 template
        :param item: original item from parsed model
        :return:
        """
        if isinstance(item, Function):
            mapping_name = item.name + item.message_type.name.capitalize()
        else:
            mapping_name = item.name

        if mapping_name not in self.mapping:
            return
        custom = self.mapping[mapping_name]

        if 'params' in custom:
            for data in custom['params']:
                missed = list(set(self.params._fields) - set(data.keys()))
                if missed:
                    self.logger.warning('not valid %s', str(data))
                    continue
                render['params'][data['key']] = self.params(**data)
            del custom['params']
        if 'script' in custom:
            script = self.get_file_content(custom['script'])
            if script:
                render['script'] = script
            del custom['script']

        for name, mapping in custom.copy().items():
            if not isinstance(mapping, dict):
                continue
            for section, data in mapping.copy().items():
                if section == '-methods' and name in render['methods']:
                    redundant = list(custom[name].copy().keys())
                    redundant.remove('-methods')
                    if redundant:
                        self.logger.info('%s/%s, "-methods" provided, skipping: %s',
                                         mapping_name, name, str(redundant))
                    del render['methods'][name]
                    del custom[name]
                    break
                if section in render:
                    if section == 'imports':
                        for field in data:
                            missed = list(set(getattr(self, section)._fields) - set(field.keys()))
                            if missed:
                                self.logger.error('%s/%s/%s, redundant: %s', mapping_name, name, section, missed)
                                continue
                            render[section].add(self.imports(**field))
                    elif name in render[section]:
                        redundant = list(set(data.keys()) - set(getattr(self, section)._fields))
                        if redundant:
                            self.logger.error('%s/%s/%s, redundant: %s', mapping_name, name, section, redundant)
                            continue
                        if 'description' in data:
                            data['description'] = self.extract_description(data['description'])
                        render[section][name] = render[section][name]._replace(**data)
                    else:
                        self.logger.warning('%s/%s not exist, skipping it.', mapping_name, name)
                    del custom[name][section]
                else:
                    self.logger.warning('%s/%s/%s not exist, skipping it.', mapping_name, name, section)
                    del custom[name]
            if name in custom and not custom[name]:
                del custom[name]

        render.update(custom)
