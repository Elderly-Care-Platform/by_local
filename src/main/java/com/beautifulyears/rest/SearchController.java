package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.rest.response.DiscussResponse.DiscussPage;
import com.beautifulyears.rest.response.UserProfileResponse;
import com.beautifulyears.rest.response.UserProfileResponse.UserProfilePage;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

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
	public SearchController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{term}" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> search(
			@PathVariable(value = "term") String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "3") int pageSize) {
		try {

			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria).sortByScore()
					.with(new PageRequest(0, 10));
			query.with(new Sort(Sort.Direction.DESC,
					new String[] { "createdAt" }));
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			query.with(pageable);
			query.addCriteria(Criteria.where("status").is(DiscussConstants.DISCUSS_STATUS_ACTIVE));

			System.out.println("search term  = " + term);

			List<Discuss> list = this.mongoTemplate.find(query, Discuss.class);
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
			@PathVariable(value = "discussType") String discussType,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "3") int pageSize) {
		try {

			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}
			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			query.with(pageable);
			query.addCriteria(Criteria.where("status").is(DiscussConstants.DISCUSS_STATUS_ACTIVE));
			if (discussType != null && !discussType.equals("")) {
				// ???q.addCriteria(Criteria.where("tags").regex(term,"i").orOperator(Criteria.where("text").regex(term,"i").orOperator(Criteria.where("title").regex(term,"i")).and("discussType").is((String)discussType)));
				query.addCriteria(Criteria.where("discussType").is(
						(String) discussType));
			}

			System.out.println("search term  = " + term);

			List<Discuss> list = this.mongoTemplate.find(query, Discuss.class);

			System.out.println("discuss type = " + discussType
					+ " :: search term  = " + term);

			System.out.println("search query = " + query.toString());
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}
	
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "service/{term}" }, produces = { "application/json" })
	@ResponseBody
	public List<UserProfile> searchServices(
			@PathVariable(value = "term") String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "3") int pageSize) {
		try {

			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			query.addCriteria(Criteria.where("status").is(DiscussConstants.DISCUSS_STATUS_ACTIVE));
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}
			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			query.with(pageable);

			System.out.println("search term  = " + term);

			List<UserProfile> list = this.mongoTemplate.find(query, UserProfile.class);

			System.out.println("search query = " + query.toString());
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<UserProfile>();
		}
	}
	
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/discussPageSearch" }, produces = { "application/json" })
	@ResponseBody
	public Object getDiscussPage(
			@RequestParam(value = "term",required = true) String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		DiscussPage discussPage = null;
		try {
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			
			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			query.addCriteria(Criteria.where("status").is(DiscussConstants.DISCUSS_STATUS_ACTIVE));
			query.with(pageable);

			System.out.println("search term  = " + term);

			
			List<Discuss> stories = this.mongoTemplate.find(query, Discuss.class);

			long total = this.mongoTemplate.count(query, Discuss.class);
			PageImpl<Discuss> storyPage = new PageImpl<Discuss>(stories, pageable,
					total);
			
			discussPage = DiscussResponse.getPage(storyPage, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussPage);
	}
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/servicePageSearch" }, produces = { "application/json" })
	@ResponseBody
	public Object getServicePage(
			@RequestParam(value = "term",required = true) String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		UserProfilePage profilePage = null;
		try {
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			
			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			query.with(pageable);

			List<UserProfile> profiles = this.mongoTemplate.find(query, UserProfile.class);

			long total = this.mongoTemplate.count(query, UserProfile.class);
			PageImpl<UserProfile> storyPage = new PageImpl<UserProfile>(profiles, pageable,
					total);
			
			profilePage = UserProfileResponse.getPage(storyPage, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(profilePage);
	}

}
