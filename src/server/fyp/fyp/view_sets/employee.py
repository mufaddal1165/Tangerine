from serializers.rest import EmployeeSerializer,DivergingSerializer,ScatterSerializer
# from rest_framework_mongoengine import viewsets
from rest_framework import viewsets
from rest_framework.response import Response
from services.fetcher import count_by_attr,count_group_by_attr,get_scatter

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

class ScatterViewSet(viewsets.ViewSet):
    serializer_class = ScatterSerializer

    def list(self,request):
        dat = get_scatter(
            request.query_params['x'],
            request.query_params['y'],
            request.query_params['z']
        )
        serializer = ScatterSerializer(
            instance=dat.values(),many=True
        )
        return Response(serializer.data)