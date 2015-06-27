package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;

/**
 * The REST based service for managing "search"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping(value = { "/search" })
public class SearchController {
	private MongoTemplate mongoTemplate;

	@Autowired
	public SearchController(
			MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{term}" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> search(@PathVariable(value = "term") String term) {
		try {

			// term = "/" + term + "/i";
			System.out.println("search term  = " + term);

			Query q = new Query();
			q.addCriteria(Criteria.where("text").regex(term, "i"));// .orOperator(Criteria.where("text").regex(term).orOperator(Criteria.where("title").regex(term).orOperator(Criteria.where("subTopicId").regex(term)))));

			// q.addCriteria(Criteria.where("tags").regex(term,"i").orOperator(Criteria.where("text").regex(term,"i").orOperator(Criteria.where("title").regex(term,"i"))));
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));

			System.out.println("search query = " + q.toString());
			List<Discuss> list = this.mongoTemplate.find(q, Discuss.class);
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{term}/{discussType}" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> searchFilterByDiscussType(
			@PathVariable(value = "term") String term,
			@PathVariable(value = "discussType") String discussType) {
		try {

			// term = "/" + term + "/i";
			System.out.println("discuss type = " + discussType
					+ " :: search term  = " + term);

			Query q = new Query();

			if (discussType != null && !discussType.equals("")) {
				// ???q.addCriteria(Criteria.where("tags").regex(term,"i").orOperator(Criteria.where("text").regex(term,"i").orOperator(Criteria.where("title").regex(term,"i")).and("discussType").is((String)discussType)));
				q.addCriteria(Criteria.where("text").regex(term, "i")
						.and("discussType").is((String) discussType));
			} else {
				// ???q.addCriteria(Criteria.where("tags").regex(term,"i").orOperator(Criteria.where("text").regex(term,"i").orOperator(Criteria.where("title").regex(term,"i"))));
				q.addCriteria(Criteria.where("text").regex(term, "i"));
			}
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));

			System.out.println("search query = " + q.toString());
			List<Discuss> list = this.mongoTemplate.find(q, Discuss.class);
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}

}
