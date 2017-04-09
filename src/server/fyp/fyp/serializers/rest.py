from rest_framework import serializers,fields
from models import Employee

class EmployeeSerializer(serializers.Serializer):
    _id = fields.CharField()
    count = fields.IntegerField()

class NestedDivergingSerializer(serializers.Serializer):
    attr : fields.CharField()
    count = fields.IntegerField() 

class DataDiverging(serializers.Serializer):
    _id = fields.CharField()
    children = fields.ListField()


class DivergingSerializer(serializers.Serializer):
    _id = fields.CharField()
    children = fields.ListField()

class ScatterSerializer(serializers.Serializer):
    attr1 = fields.IntegerField()
    attr2 = fields.IntegerField()
    attr3 = fields.IntegerField()

class DecisionTreeSerializer(serializers.Serializer):
    tree = fields.DictField()

class WordCloud(serializers.Serializer):
    cloud = fields.DictField()

class BrandPerception(serializers.Serializer):
    perceptions = fields.DictField()

