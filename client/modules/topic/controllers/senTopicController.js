"use strict";
CQ.mainApp.topicController
    .controller("senTopicController", ["$rootScope", "$scope", "TopicFacService", "$http", "ngDialog", "$state", "$timeout", 
    function($rootScope, $scope, 
    TopicFacService, $http, ngDialog, $state, $timeout) {
        console.log("senTopicController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("topic app start!!!");
                App.runui();
                getTopicData();
                $timeout(function(){
                    console.log($(".lead").length);
                    $(".lead").mouseover(function(event) {
                        /* Act on the event */
                        $(".title").css({left:event.clientX,top:event.clientY});
                        $(".title").text($(this).data("mytitle"));
                        $(".title").fadeIn("fast");
                    });
                    $(".lead").mouseout(function(event) {
                        /* Act on the event */
                        $(".title").fadeOut("fast");
                    });
                },1000);
            }
        });
        
        function getTopicData() {
            var cons = {};
            cons.userId = 1;
            TopicFacService.getSenTopicData(cons).then(function(res){
                console.log(res);
                var imgs2 = ["/static/assets/img/1.jpg","/static/assets/img/2.jpg","/static/assets/img/3.jpg"];
                var imgs3 = ["/static/assets/img/ky1.jpg","/static/assets/img/ky2.jpg","/static/assets/img/ky3.jpg"];
                var imgs4 = ["/static/assets/img/gk1.jpg","/static/assets/img/gk2.jpg","/static/assets/img/gk3.jpg"];
                var imgs9 = ["/static/assets/img/da1.jpg","/static/assets/img/da2.jpg","/static/assets/img/da3.jpg"];
                var imgs12 = ["/static/assets/img/zbqc1.jpg","/static/assets/img/zbqc2.jpg","/static/assets/img/zbqc3.jpg"];
                var imgs8 = ["/static/assets/img/8-1.jpg","/static/assets/img/8-2.jpg","/static/assets/img/8-3.jpg","/static/assets/img/8-4.jpg"];
                var imgs99 = ["/static/assets/img/9-1.jpg","/static/assets/img/9-2.jpg","/static/assets/img/9-3.jpg"];
                res.forEach(function(d) {
                    // var limitLen = 40;
                    // try{
                    //     if(d.summary.length > limitLen)
                    //     {
                    //         d.summary = d.summary.substring(0,limitLen) + "...";
                    //     }
                    // }
                    // catch(err)
                    // {
                    //     console.log(err);
                    // }
                    if(d.topicId == 2) {
                        d.imgs = imgs9;
                    }else if(d.topicId == 1) {
                        d.imgs = imgs4;
                        // d.summary = "各大高校研究生复试工作正在进行，大多数高校已经录取结束";
                    }else if(d.topicId == 0) {
                        d.imgs = imgs2;
                    }else if(d.topicId == 3) {
                        d.imgs = imgs12;
                    }else if(d.topicId == 9) {
                        d.imgs = imgs99;
                    }else if(d.topicId == 8) {
                        d.imgs = imgs8;
                    }else if(d.topicId > 4) {
                        // d.summary = "各个地方成人高考报名工作开始";
                        d.imgs = imgs2;
                    }
                    //d.imgs = imgs;
                });
                var topicWeight={"十九大":100,"高考":90,"成考":80,"作弊":70};
                res.sort(function(a,b){
                    return topicWeight[b.topicName]-topicWeight[a.topicName]>0?1:-1;
                });
                $scope.data = res;
                setTimeout(function(){
                    $scope.$apply(function(){
                            drawClouds();
                    　　　　});
                　}, 1000);

                
            },function(error) {
                console.log(error);
            });
        }

        function drawClouds() {
            $scope.data.forEach(function (d) {
                var doms = "wordsCloud_" + d.topicId;
                if(document.getElementById(doms) != undefined) {
                    //console.log("aaa");
                var color = d3.scale.category10();
                var i = 0;
                var chart = echarts.init(document.getElementById(doms));
                var options = {
                    series: [{
                        type: 'wordCloud',
                        gridSize: 1,
                        sizeRange: [5, 35],
                        rotationRange: [0, 45],
                        shape: 'circle',
                        textStyle: {
                            normal: {
                                color: function(){return color(i++)},
                                }
                            },
                        data: []
                    }]
                };
                var keylists = [];
                d.topicKeywords=new Set(d.topicKeywords);
                d.topicKeywords.forEach(function (d) {
                    var tt = {};
                    tt.name = d;
                    tt.value = Math.random() * 50 + 50;
                    keylists.push(tt);
                });
                options.series[0].data = keylists;
                chart.setOption(options);
                var searchPost = function(param)
                {
                    $state.go("yuqingTrendsController",{"keywords":[keylists[param.dataIndex].name],"topicIds":[d.topicId]});
                }
                chart.on("click",searchPost);
                }
            });
        }
        $scope.searchPostByTopic = function(topicId)
        {
            $state.go("yuqingTrendsController",{"topicIds":[topicId]});
        }
        $scope.openTopicModal = function(topicId){
            $state.go("senTopicAnalysController",{topicId: topicId});
        };
        $scope.openUserModal = function(topicId){
            $state.go("senuserAnalysController",{topicId: topicId});
        };

    }])
    .controller("senTopicAnalysController", ["$rootScope", "$scope", "$http", "$stateParams", "TopicFacService", "SearchFacService", "$state","$timeout",
        function($rootScope, $scope, $http, $stateParams, TopicFacService, SearchFacService, $state,$timeout) {
        console.log("topicAnalys", "start!!!");
            var page_num=10,pages,posts,page=1;
        // $scope.filters = {"start_time":"","site":[],"topicIds":[],"end_time":"", "filter":"", "filtertype":0};
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                App.runui();
                $scope.trans = false;
                getSen_hot($stateParams.topicId);
                getSenTopicData($stateParams.topicId);
            }
        });
        function getSen_hot() {
            var cons = {};
            cons.userId = 1;
            cons.topicId = $stateParams.topicId;
            TopicFacService.getSen_hot(cons).then(function (res) {
                // res.forEach(function () {
                //
                // })
                console.log(res);
                $scope.sen_hot = res;
                var composite = dc.compositeChart('#dayChart');
                var ndx = crossfilter($scope.sen_hot),
                timeDimension = ndx.dimension(function (d) {
                    return new Date(d.date);
                }),
                pred = timeDimension.group().reduceSum(function (d) {
                    return +d.predict_value;
                }),
                real = timeDimension.group().reduceSum(function (d) {
                    return +d.real_value;
                });
                var width = $("#dayChart").width(),
                    height = $("#dayChart").height();
                composite
                    .width(width)
                    .height(height)
                    // .x(d3.scale.linear().domain([0,20])
                    //  .dimension(timeDimension)
                    .yAxisLabel("帖子数量")
                    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
                    .xAxisLabel("时间")
                    .renderHorizontalGridLines(true)
                    .x(d3.time.scale())
                    .compose([
                        dc.lineChart(composite)
                            .dimension(timeDimension)
                            .group(pred,"预测值")
                            .colors('red')
                            .dashStyle([2,2]),
                        dc.lineChart(composite)
                            .dimension(timeDimension)
                            .group(real,"真实值")
                            .colors('blue')
                        ])
                    // .round(d3.time.days.round)
                    .elasticX(true)
                    // .xUnits(d3.time.days)
                    .brushOn(false)
                    .xAxis()
                    .tickFormat(d=>{
                        var year = d.getFullYear(),
                        month = d.getMonth()+1,
                        day = d.getDate();
                        month = month < 10 ? '0' + month : month;
                        day = day < 10 ? '0' + day : day;
                       return [year,month,day].join('-');
                    });
                    // .render();
                    if(!$scope.sendata)//页面数据没有请求完成
                    {
                        $("#load").show();
                    }
            });
            };
        function getSenTopicData(topicId) {
            // console.log('ssssssss')
            var cons = {};
            cons.userId = 1;
            cons.topicId = $stateParams.topicId;
             TopicFacService.getSenTopicAnalyData(cons).then(function(res){
                 res.forEach(function (d) {
                     res.is_tran = false;
                     // console.log(d);
                     if(d.lan_type==0)
                         d.lan_type='简体中文';
                     if(d.lan_type==1)
                         d.lan_type='英文';
                     if(d.lan_type==2)
                         d.lan_type='日文';
                     if(d.lan_type==3)
                         d.lan_type='繁体中文';
                 })
                 // $scope.sendata =res;
                 posts = res;
                 pages=~~(posts.length/page_num)+1;
                 $scope.sendata=posts.slice(0,page_num);
                 $scope.sendata.forEach(function (t) {
                     var img = new Image();
                     img.src = t.poster.img_url;
                     img.onerror = function () {
                         t.poster.img_url = '/static/assets/icon/twitter.svg';
                         $scope.$digest();
                     }
                 })
                 $timeout(function(){
                     $("#loading").hide();
                     var beforeScolltop=$("#posts").scrollTop();
                     $("#posts").scroll(function(){
                         console.log($("#posts").scrollTop());
                         if($("#posts").scrollTop()>beforeScolltop)
                         {
                             if($("#posts").scrollTop()+$("#posts").height()+150>$("#posts>ul").height()&&page<=pages)
                             {
                                 $("#loading").show();
                                 $timeout(function(){
                                     $scope.sendata=posts.slice(0,(++page)*page_num);
                                     $("#loading").hide();
                                 },1000);
                             }
                             beforeScolltop=$("#posts").scrollTop();
                         }
                     });
                 },0);
                drawChart(res);
                if(!$scope.sen_hot)//页面数据没有请求完成
                {
                    $("#load").show();
                }
            },function(error) {
                console.log(error);

            });
        }
            function dateFormat(date)
            {
                var year=date.getFullYear(),
                    month=date.getMonth()+1,
                    day=date.getDate();
                month=month<10?'0'+month:month;
                day=day<10?'0'+day:day;
                return year+'-'+month+'-'+day;
            }
            function getPosts(data)
            {
                page=1;
                posts=data.reverse();
                pages=~~(posts.length/page_num)+1;
                $("#posts").slimScroll({scrollTo:0});
                $scope.sendata=posts.slice(0,page_num);
            }
            function drawChart(data) {
                var ndx = crossfilter(data),
                    all = ndx.groupAll(),
                    // dayDist = dc.lineChart("#dayChart"),
                    dayDim = ndx.dimension(function(d) {
                        if(d.pt_time)
                            return dateFormat(new Date(d.pt_time));
                        else if(d.topic_post_time)
                            return dateFormat(new Date(d.topic_post_time));
                    }),
                    dayGroup = dayDim.group().reduceSum(function (d) {
                        return 1;
                    });
                // drawLineDayDist(dayDist, dayDim, dayGroup);
                var datatypeDist = dc.pieChart("#siteChart"),
                    datatypeDim = ndx.dimension(function (d) {
                        return d.lan_type;
                    }),
                    datatypeGroup = datatypeDim.group().reduceSum(function(d) {
                        return 1;
                    });
                drawPieDatatypeDist(datatypeDist, datatypeDim, datatypeGroup);
            }
            function drawPieDatatypeDist(datatypeDist, datatypeDim, datatypeGroup) {
                var width = $("#siteChart").width(),
                    height = $("#siteChart").height(),
                    sum = datatypeDim.groupAll().reduceSum(function(d){return 1;}).value(),
                    r = width > height ? height * 0.4 : width * 0.4;
                datatypeDist
                    .width(width)
                    .height(height)
                    .innerRadius(40)
                    .radius(r)
                    .cx(width*0.6)
                    .cy(height*0.5)
                    .dimension(datatypeDim)
                    .group(datatypeGroup)
                    .legend(dc.legend().horizontal(false).x(0).y(width*0.1).legendText(function(d){return d.name;}));
                // datatypeDist.addFilterHandler(function(filters, filter) {
                //         filters.push(filter);
                //         post_filters.site = filters;
                //         return filters;
                // });
                datatypeDist.on("filtered", function(){
                    // console.log(post_filters);
                    // console.log(getPosts());
                    $timeout(function(){
                        getPosts(datatypeDim.top(Infinity))
                    },0);
                });
                // datatypeDist.onClick(function(datum){console.log(datum)});
                dc.renderAll();
                $("#loading1").hide();
                $("#loading2").hide();
            }
            $scope.translate = function(post) {
                $scope.sendata.forEach(function (t) {
                    if(t.url == post.url)
                        t.is_trans = !t.is_trans;
                })
            }
            $scope.showTrans=function(post)
            {
                post.showTrans = true;
            }
            $scope.hideTrans=function(post)
            {
                post.showTrans = false;
            }
            function drawLineDayDist(dayDist, dayDim, dayGroup){
                var width = $("#dayChart").width(),
                    height = $("#dayChart").height(),
                    bars=dayGroup.size(),
                    xtick=80,
                    chart = dayDist.width(width)
                        .height(height)
                        .margins({top: 20, right: 10, bottom: 28, left: 40})
                        .dimension(dayDim)
                        .group(dayGroup)
                        .elasticY(true)
                        .yAxisPadding('10%') //设置y轴距离顶部的距离(为了renderLabel才设置)
                        // .centerBar(false)
                        .round(dc.round.floor)
                        // .alwaysUseRounding(true)
                        .renderLabel(true)
                        // .outerPadding(0.2)
                        .controlsUseVisibility(true)
                        .x(d3.scale.ordinal())
                        // .elasticX(true)
                        .xUnits(dc.units.ordinal)
                        .yAxisLabel("帖子数量")
                        .xAxisLabel("时间")
                        .renderHorizontalGridLines(true);
                chart.yAxis()
                    .ticks(5)
                    .tickFormat(function(d){
                        return +d;
                    });
                chart.xAxis()
                    .tickFormat(function(d,i){
                        return i%Math.ceil(bars*xtick/width)==0?d:"";
                    });
                chart.on("filtered", function(){
                    // console.log(post_filters);
                    // console.log(getPosts());
                    $timeout(function(){getPosts(dayDim.top(Infinity))},0);
                    // getPosts(dayDim.top(Infinity));
                    console.log(dayDim.top(Infinity));
                });
                dayDist.render();
            }

    }])
    .controller("senuserAnalysController", ["$rootScope", "$scope", "$http", "$stateParams", "TopicFacService", "SearchFacService", "$state", "$timeout",
        function($rootScope, $scope, $http, $stateParams, TopicFacService, SearchFacService, $state, $timeout) {
        console.log("topicAnalys", "start!!!");
        $scope.allPosts = [];
        $scope.showPosts = [];
        $scope.allUsers = [];
        $scope.showUsers = [];
        $scope.showUserIndex = 0;
        $scope.tablepage=1;
        $scope.topicId = $stateParams.topicId;
        $scope.getTableData = function(page,data){
            if(data)
                $scope.allUsers=data;
            var page_num = 6;
            $scope.max_page=Math.ceil($scope.allUsers.length/page_num);
            var pageset_min=[1,2,3,4,5],pageset_max=pageset_min.map(d=>d+$scope.max_page-5);
            if(page<1||page>$scope.max_page)
                return null;
            $scope.counts=$scope.allUsers.length;
            $scope.showUsers=$scope.allUsers.slice(page*page_num-page_num,page*page_num);
            console.log($scope.showUsers);
            $scope.tablepage=page;
            if($scope.max_page<5)
            {
                $scope.pageset=[];
                for(var i=1;i<$scope.max_page+1;i++)
                    $scope.pageset.push(i);
            }
            else if(page<4)
                $scope.pageset=angular.copy(pageset_min);
            else if(page>$scope.max_page-3)
                $scope.pageset=angular.copy(pageset_max);
            else
                $scope.pageset=pageset_min.map(d=>d+page-3);
            //获得用户帖子
            $timeout(function(){
                $(".before").hide();
                // $("#userlist > ul > li:nth-child(1) > div > div").show();
                // $(".posts").css({"margin-top":0});
                // $scope.$broadcast('rebuild:me');
            },0);
            $scope.showUserpost(0,0);
        }
        getData();
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                App.runui();
                // $timeout(function(){
                //     var max_posts_height = $(window).height()-105;
                //     $(".posts").css({"max-height":max_posts_height});
                // },0);
            }
        });
        $scope.showUserpost = function(uid,i,ev)
        {
            $scope.showUserIndex = i;
            // $scope.showPosts = $scope.allPosts.filter(d=>d.poster.user_id == uid);
            // $(".posts").height("auto");
            $scope.showPosts = $scope.showUsers[i].posts;//获得用户帖子
            $timeout(function(){
                $(".posts").css({"margin-top":0});
                var postsTY = $(".posts").offset().top;
                var max_posts_height = $(window).height()-postsTY-50;
                // $(".posts").height($(".posts").height());
                console.log(Math.min(max_posts_height,$("#posts").height()));
                // $(".posts").parent(".slimScrollDiv").css({"height":Math.min(max_posts_height,$(".posts").height())});
                $(".before").hide();
                if(ev)
                    var before = $(ev.target).find(".before");
                else
                    before = $("#userlist > ul > li:nth-child(1) > div > div");
                before.show();
                // $(".posts").height("auto");
                $(".posts").height(Math.min(max_posts_height,$("#posts").height()));
                // $(".posts").slimScroll({.k
                //     height: Math.min(max_posts_height,$("#posts").height()),
                //     // alwaysVisible: true,
                // });
                postsTY = $(".posts").offset().top;
                var postsBY = $(".posts").height()+postsTY;
                var beforeY = before.offset().top;
                if(beforeY+40>postsBY)
                {
                    // $(".posts").parent(".slimScrollDiv").css({"margin-top":Math.max(postsTY+beforeY - postsBY/2,0)});
                    if(beforeY+(postsBY-postsTY)/2<max_posts_height)
                        $(".posts").css({"margin-top":Math.max(beforeY - postsBY/2-postsTY/2,0)});
                    else
                        $(".posts").css({"margin-top":Math.max(beforeY+40-postsBY,0)});
                }
                $scope.$broadcast('rebuild:me');
            },0);
        }
        $scope.showTrans=function(post)
        {
            post.showTrans = true;
        }
        $scope.hideTrans=function(post)
        {
            post.showTrans = false;
        }
        $scope.translate = function(post)//翻译
        {
            if(!post.trans_content)
            {
                TopicFacService.getTranslate({"url":post.post_url}).then(function(res){
                    post.trans_content = res;
                });
            }
            post.is_trans = !post.is_trans;
        }
        function getData()//获取页面数据
        {
            TopicFacService.getTopicUserAnalyData({topicId:$scope.topicId}).then(function(res){
                console.log(res);
                res.forEach(user=>{
                    user.posts.forEach(post=>{
                        post.user_name = user.poster.name;
                        post.post_img = user.poster.img_url;
                    });
                });
                $scope.allUsers = res;
                console.log($scope.allUsers);
                $scope.getTableData(1);
            });
        }
    }]);