package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.menu.Menu;
import com.beautifulyears.domain.menu.Tag;

@Controller
@RequestMapping({ "/menu" })
public class MenuController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public MenuController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "/tag" })
	@ResponseBody
	public Object getTags() {
		List<Tag> menus = this.mongoTemplate.findAll(Tag.class);
		return menus;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "getAllMenu" })
	@ResponseBody
	public Object getAllMenu() {
		List<Menu> menus = this.mongoTemplate.findAll(Menu.class);
		return menus;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = { "application/json" }, value = { "getMenu" })
	@ResponseBody
	public Object getMenu(
			@RequestParam(value = "id", required = false) String id,
			@RequestParam(value = "parentId", required = false) String parentId) {
		Query q = new Query();
		if (null != id) {
			q.addCriteria(Criteria.where("id").is(new ObjectId(id)));
		}
		if (null != parentId) {
			if("root".equals(parentId.toString())){
				parentId = null;
			}
			q.addCriteria(Criteria.where("parentMenuId").is(parentId));
		}

		List<Menu> menus = this.mongoTemplate.find(q, Menu.class);
		return menus;
	}

}
