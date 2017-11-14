"use strict";

angular.module('topicService',['commons'])
    .factory("TopicFac", ['$resource', 'parseResource', function ($resource, parseResource) {
        var factories = {};
        factories.topicData = $resource(CQ.variable.RESTFUL_URL + "topic_statistics", parseResource.params, parseResource.actions);
        factories.hotTopicData = $resource(CQ.variable.RESTFUL_URL + "hot_topic", parseResource.params, parseResource.actions);
        factories.senTopicData = $resource(CQ.variable.RESTFUL_URL + "sen_topic", parseResource.params, parseResource.actions);
        factories.topicAnaly = $resource(CQ.variable.RESTFUL_URL + "hot_topic_analysis", parseResource.params, parseResource.actions);
        factories.topicUserAnaly = $resource(CQ.variable.RESTFUL_URL + "user_analysis", parseResource.params, parseResource.actions);
        factories.senTopicAnaly = $resource(CQ.variable.RESTFUL_URL + "wallpost", parseResource.params, parseResource.actions);
        factories.translate = $resource(CQ.variable.RESTFUL_URL + "translate", parseResource.params, parseResource.actions);  
        factories.getSen_hot = $resource(CQ.variable.RESTFUL_URL + "sen_hot", parseResource.params, parseResource.actions);
        return factories;
    }])
    .factory("TopicFacService",['TopicFac', 'RestService', function(TopicFac, RestService) {
        var factories = {};
        factories.getTopicData = function(params) {
            return RestService.get(TopicFac.topicData, params);
        };
        factories.getHotTopicData = function(params) {
            return RestService.get(TopicFac.hotTopicData, params);
        };
        factories.getSenTopicData = function(params) {
            return RestService.get(TopicFac.senTopicData, params);
        };
        factories.getTopicAnalyData = function(params) {
            return RestService.get(TopicFac.topicAnaly, params);
        };
        factories.getTopicUserAnalyData = function(params) {
            return RestService.get(TopicFac.topicUserAnaly, params);
        };
        factories.getSenTopicAnalyData = function(params) {
            return RestService.get(TopicFac.senTopicAnaly, params);
        };
        factories.getTranslate = function(params) {
            return RestService.get(TopicFac.translate, params);
        };
        factories.getSen_hot = function(params) {
            return RestService.get(TopicFac.getSen_hot, params);
        };
        return factories;
    }]);