package com.beautifulyears.rest;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.Topic;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.TopicRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.rest.response.DiscussResponse.DiscussEntity;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping(value = { "/discuss" })
public class DiscussController {
	private static final Logger logger = Logger.getLogger(DiscussController.class);
	private DiscussRepository discussRepository;
	private MongoTemplate mongoTemplate;
	private TopicRepository topicRepository;
	private ResponseEntity responseEntity;

	@Autowired
	public DiscussController(DiscussRepository discussRepository,
			DiscussRepositoryCustom discussRepositoryCustom,
			TopicRepository topicRepository,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		this.topicRepository = topicRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<String> submitDiscuss(@RequestBody Discuss discuss,HttpServletRequest request,HttpServletResponse res) throws IOException {
		LoggerUtil.logEntry();
		ResponseEntity<String> responseEntity = new ResponseEntity(
				HttpStatus.CREATED);
		User currentUser = Util.getSessionUser(request);
		if(null != currentUser){
			if (discuss == null || discuss.getId() == null
					|| discuss.getId().equals("")) {
				
				discuss.setUserId(currentUser.getId());
				discuss.setUsername(currentUser.getUserName());
				Discuss discussWithExtractedInformation = this
						.setDiscussBean(discuss);
				discuss = discussRepository.save(discussWithExtractedInformation);
				logger.info("new discuss entity created with ID: "+discuss.getId()+" by User "+(null != Util.getSessionUser(request)   ? Util.getSessionUser(request).getId() : null));
				
			}else{
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
				return null;
			}
		}else{
			res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		}
		return responseEntity;
		
		
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> allDiscuss(@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) {
		LoggerUtil.logEntry();
		List<DiscussEntity> list = queryDiscuss(null, null, null, null,sort,request);
		return list;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all/{discussType}" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> showDiscussByDiscussType(
			@PathVariable(value = "discussType") String discussType,
			@RequestParam(value = "featured", required = false) Boolean isFeatured,
			@RequestParam(value = "count", required = false, defaultValue = "0") int count,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) {
		LoggerUtil.logEntry();
		Map<String, Object> filters = null;
		if(null != isFeatured){
			filters = new HashMap<String, Object>();
			filters.put("isFeatured", isFeatured);
		}
		
		List<DiscussEntity> list = queryDiscuss(discussType, null, null, filters,sort,request);
		return list;

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/all" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> allDiscussDiscussTypeAndTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) {
		LoggerUtil.logEntry();
		List<DiscussEntity> list = queryDiscuss(discussType, topicId, null, null,sort,request);
		return list;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> allDiscussByUser(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			@PathVariable(value = "userId") String userId,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) {
		LoggerUtil.logEntry();
		Map<String, Object> filters = null;
		if(null != userId){
			filters = new HashMap<String, Object>();
			filters.put("userId", userId);
		}
		List<DiscussEntity> list = queryDiscuss(discussType, topicId, subTopicId, filters,sort,request);
		return list;

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> discussByDiscussTypeTopicAndSubTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) {
		LoggerUtil.logEntry();
		List<DiscussEntity> list = queryDiscuss(discussType, topicId, subTopicId, null,sort,request);
		return list;
	}

	private List<DiscussEntity> queryDiscuss(String discussType, String topicId,
			String subTopicId, Map<String, Object> filters, String sort,
			HttpServletRequest request) {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse(); 
		try {
			Query q = getQuery(discussType, topicId, subTopicId, filters,sort);
			List<Discuss> list = (List<Discuss>)this.mongoTemplate.find(q,Discuss.class);
			discussResponse.add(list,Util.getSessionUser(request));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return discussResponse.getResponse();
	}

	private String querySize(String discussType, String topicId,
			String subTopicId, Map<String, Object> filters) {
		LoggerUtil.logEntry();
		JSONObject obj = new JSONObject();
		try {
			Long articlesCount = this.mongoTemplate.count(
					getQuery("A", topicId, subTopicId, filters,null), Discuss.class);
			Long questionsCount = this.mongoTemplate.count(
					getQuery("Q", topicId, subTopicId, filters,null), Discuss.class);
			Long postsCount = this.mongoTemplate.count(
					getQuery("P", topicId, subTopicId, filters,null), Discuss.class);
			obj.put("a", articlesCount);
			obj.put("q", questionsCount);
			obj.put("p", postsCount);
			obj.put("z", articlesCount + questionsCount + postsCount);

		} catch (Exception e) {
			obj.put("a", 0);
			obj.put("p", 0);
			obj.put("q", 0);
			obj.put("z", 0);
		}
		return obj.toString();
	}

	private Query getQuery(String discussType, String topicId,
			String subTopicId, Map<String, Object> filters, String sortBy) {
		LoggerUtil.logEntry();
		Query q = new Query();
		if (null != discussType && !discussType.equalsIgnoreCase("All")
				&& !discussType.equalsIgnoreCase("list")) {
			q.addCriteria(Criteria.where("discussType")
					.is((Object) discussType));
		} else {
			q.addCriteria(Criteria.where((String) "discussType").in(
					new Object[] { "A", "Q", "P" }));
		}
		if (null != subTopicId && !subTopicId.equalsIgnoreCase("All")
				&& !subTopicId.equalsIgnoreCase("list")) {
			q.addCriteria(Criteria.where("topicId").in(
					new Object[] { subTopicId }));
		} else if (null != topicId && !topicId.equalsIgnoreCase("All")
				&& !topicId.equalsIgnoreCase("list")) {
			q.addCriteria(Criteria.where("topicId")
					.in(new Object[] { topicId }));
		}
		if(null != filters){
			for (Map.Entry<String, Object> filter : filters.entrySet())
			{
				q.addCriteria(Criteria.where(filter.getKey()).is(filter.getValue()));
			}
		}
		q.addCriteria(Criteria.where("status").in(new Object[] {0,null}));
		if(!Util.isEmpty(sortBy)){
			q.with(new Sort(Sort.Direction.DESC, new String[] { sortBy }));
		}
		
		return q;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/count/{discussType}/{topicId}/{subTopicId}" }, produces = { "plain/text" })
	@ResponseBody
	public String discussByDiscussTypeTopicAndSubTopicCount(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId) {
		LoggerUtil.logEntry();
		return querySize(discussType, topicId, subTopicId, null);
		
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/show/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public Discuss showDiscuss(
			@PathVariable(value = "discussId") String discussId) {
		LoggerUtil.logEntry();
		Discuss discuss = (Discuss) discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return discuss;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public DiscussEntity getDiscuss(
			@PathVariable(value = "discussId") String discussId,HttpServletRequest req) {
		LoggerUtil.logEntry();
		DiscussResponse res = new DiscussResponse();
		Discuss discuss = (Discuss) discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return res.getDiscussEntity(discuss, Util.getSessionUser(req));
	}

	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public Discuss editDiscuss(
			@PathVariable(value = "discussId") String discussId) {
		LoggerUtil.logEntry();
		Discuss discuss = (Discuss) discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return discuss;
	}

	@RequestMapping(method = { RequestMethod.DELETE }, value = { "/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity deletePost(
			@PathVariable(value = "discussId") String discussId) {
		LoggerUtil.logEntry();
		System.out.println("Inside DELETE");
		discussRepository.delete(discussId);
		ResponseEntity responseEntity = new ResponseEntity(HttpStatus.CREATED);
		System.out.println("responseEntity = " + (Object) responseEntity);
		return responseEntity;
	}

	private Discuss setDiscussBean(Discuss discuss) {
		LoggerUtil.logEntry();
		try {

			String userId = discuss.getUserId();
			String username = discuss.getUsername();
			String discussType = discuss.getDiscussType();
			String title = "";
			System.out.println("discussType = " + discussType
					+ " :: photofilename = "
					+ discuss.getArticlePhotoFilename());
			if (discussType.equalsIgnoreCase("A")) {
				title = discuss.getTitle();
			}
			String text = discuss.getText();
			int discussStatus = discuss.getStatus();
			List<String> topicId = discuss.getTopicId();
			Query q = new Query();
			q.addCriteria(Criteria.where("id").in(topicId));
			q.fields().include("topicName");
			List<Topic> topics = mongoTemplate.find(q, Topic.class);
			for (Topic topic : topics) {
				discuss.getSystemTags().add(topic.getTopicName());
			}
			int aggrReplyCount = 0;
			return new Discuss(userId, username, discussType, topicId, title,
					text, discussStatus, aggrReplyCount,discuss.getSystemTags(),discuss.getUserTags(),
					discuss.getDiscussType().equals("A") ? discuss
							.getArticlePhotoFilename() : "",false);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
