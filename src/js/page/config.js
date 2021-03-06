'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var db = require('../lib/db');
var Page = require('../lib/page');
var page = new Page;

page.extend({
	// 页面id，唯一，关系页面逻辑
	id: "config",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpConfig",

	init: function(){
		console.log('init ' + this.id);

		// 回调处理可以忽略
		// 测试过程中刷新频繁
		// 所以做一下回调
		if(app.config._id){
			this.enter();
			this.bind();
		}else{
			this.getCache(function(){
				page.enter();
				page.bind();
			})
		}
	},

	enter: function(){
		// 渲染页面
		this.render(null, app.config);
	},

	bind: function(){
		// 更新配置
		$('#updateConfig').click(function(){
			console.log('update event')
			page.setCache();
		})

		// $('#key').on('keypress', function(e){
		// 	console.log(e.keyCode)
		// 	if(e.keyCode == 13)
		// 		window.gui.Window.get().showDevTools();
		// })

		this.page.delegate('.workplace-title', 'click', function(){
			var parent = $(this).parent()
			var serverPath, localPath, iurl;

			// 更新workplace状态
			if(parent.hasClass('slide')){
				parent.removeClass('slide')
			}else{
				parent.addClass('slide')

				// 检查serverPath, localPath value值
				serverPath = parent.find('.serverPath').val();
				localPath = parent.find('.localPath').val();
				iurl = parent.find('.iurl')
				// 展示url
				if(serverPath && localPath && !iurl.html()){
					iurl.html(localPath)
				}
				// 隐藏url
				if(!serverPath || !localPath){
					iurl.html('')
				}
			}
		})

		$('#addWorkplace').click(function(){
			$(this).before($('#workplaceTemplate').html())
		})
	},
	
	setCache: function(){
		var workplace = [];

		// 获取workplace
		$('.workplace').each(function(){
			var obj = {};
			obj.server = $(this).find('.serverPath').val();
			obj.local = $(this).find('.localPath').val();

			if(obj.server && obj.local)
				workplace.push(obj)
		})

		lib.extend(app.config.config, {
			// for server
			serverEnable	: $('#serverEnable').prop('checked'),
			serverApi		: $('#serverApi').val(),
			username		: $('#username').val(),
			password		: $('#password').val(),
			workplace		: workplace,

			// for less
			lessEnable		: $('#lessEnable').prop('checked'),
			defaultHome		: $('#defaultHome').prop('checked'),
			defaultCompress	: $('#defaultCompress').prop('checked')
		});

		// 更新数据
		db.data.find({name: page.id}, function(e, docs){
			if(e){
				page.tips('数据库链接失败');
				console.log(e);
			}

			if(docs.length == 0){
				db.data.insert(app.config, function(e, doc){
					if(e) return page.tips('配置更新失败');
					app.config = doc;
					page.tips('配置更新成功');
				})
			}else{
				db.data.update({name: page.id}, app.config, function(e, num){
					if(e) return page.tips('配置更新失败');
					page.tips('配置更新成功');
				})
			}
		})

	},

	getCache: function(callback){
		// 读取全局配置信息
		db.data.find({name: app.config.name}, function(e, docs){
			if(e) return tips.show('数据库链接失败');
			docs.length > 0 ?
				app.config = docs[0] : "";

			callback(app.config)
		});
	}

});

page.reg();

module.exports = page;