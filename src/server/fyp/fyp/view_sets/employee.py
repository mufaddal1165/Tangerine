from serializers.rest import EmployeeSerializer
# from rest_framework_mongoengine import viewsets
from rest_framework import viewsets
from rest_framework.response import Response
from services.fetcher import count_by_attr

class EmployeeViewSet(viewsets.ViewSet):
    # lookup_field = 'id'
    serializer_class = EmployeeSerializer

    def list(self,request):
        
        job_sat = count_by_attr(request.query_params['q'])
        serializer = EmployeeSerializer(
            instance = job_sat.values(), many=True
        )    
        return Response(serializer.data)