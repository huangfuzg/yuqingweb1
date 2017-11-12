"use strict";
CQ.mainApp.topicController
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("topicController", {
                url:"/senTopic",
                templateUrl: "/static/modules/topic/pages/senTopic.html",
                controller: "senTopicController"
            })
            .state("senTopicAnalysController", {
                url:"/senTopic/topicanalys:topicId",
                templateUrl: "/static/modules/topic/pages/topicAnalys.html",
                controller: "senTopicAnalysController"
            })
            .state("HotTopicController", {
                url:"/hotTopic",
                templateUrl: "/static/modules/topic/pages/hotTopic.html",
                controller: "hotTopicController"
            })
            .state("hotTopicAnalysController", {
                url:"/hotTopic/:topicId",
                templateUrl: "/static/modules/topic/pages/topicAnalys.html",
                controller: "hotTopicAnalysController"
            })
            .state("senuserAnalysController", {
                url:"/senTopic/useranalys/:topicId",
                templateUrl: "/static/modules/topic/pages/senuserAnalys.html",
                controller: "senuserAnalysController"
            });
    }]);