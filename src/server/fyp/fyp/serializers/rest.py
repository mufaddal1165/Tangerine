from rest_framework import serializers,fields
from models import Employee

class EmployeeSerializer(serializers.Serializer):
    _id = fields.CharField()
    count = fields.IntegerField()



