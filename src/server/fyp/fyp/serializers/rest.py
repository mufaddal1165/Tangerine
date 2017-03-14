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
