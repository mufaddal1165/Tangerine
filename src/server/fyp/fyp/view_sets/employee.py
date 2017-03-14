from serializers.rest import EmployeeSerializer,DivergingSerializer
# from rest_framework_mongoengine import viewsets
from rest_framework import viewsets
from rest_framework.response import Response
from services.fetcher import count_by_attr,count_group_by_attr

class EmployeeViewSet(viewsets.ViewSet):
    # lookup_field = 'id'
    serializer_class = EmployeeSerializer

    def list(self,request):
        
        dat = count_by_attr(request.query_params['q'])
        serializer = EmployeeSerializer(
            instance = dat.values(), many=True
        )    
        return Response(serializer.data)

class DivergingViewSet(viewsets.ViewSet):
    serializer_class = DivergingSerializer

    def list(self,request):
        
        dat = count_group_by_attr(
            request.query_params['x'],
            request.query_params['y']
            )
        print(dat.values())
        serializer = DivergingSerializer(
            instance = dat.values(),many=True
        )
        return Response(serializer.data)
