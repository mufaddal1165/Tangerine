from services.fetcher import get_word_cloud
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from serializers.rest import WordCloudSerializer


class WordCloudViewSet(viewsets.ViewSet):
    serializer_class = WordCloudSerializer

    def list(self,request):
        cloud = get_word_cloud("putin")
        print("values are",cloud.values())
        serializer = WordCloudSerializer(
            instance = cloud.values(), many=True
        )

        return Response(serializer.data)

