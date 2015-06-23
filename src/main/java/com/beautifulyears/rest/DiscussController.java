package com.beautifulyears.rest;


import java.util.List;

import javax.servlet.http.HttpServletRequest;

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

import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.rest.response.DiscussResponse.DiscussEntity;

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

	@Autowired
	public DiscussController(DiscussRepository discussRepository,
			DiscussRepositoryCustom discussRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> submitDiscuss(@RequestBody Discuss discuss,HttpServletRequest request) {
		ResponseEntity responseEntity = new ResponseEntity(
				HttpStatus.CREATED);
		if (discuss == null || discuss.getId() == null
				|| discuss.getId().equals("")) {
			
			Discuss discussWithExtractedInformation = this
					.setDiscussBean(discuss);

			discuss = discussRepository.save(discussWithExtractedInformation);

			
			logger.info("new discuss entity created with ID: "+discuss.getId()+" by User "+(null != Util.getSessionUser(request)   ? Util.getSessionUser(request).getId() : null));
			return responseEntity;
		}else{
			Discuss newDiscuss = (Discuss) discussRepository.findOne(discuss.getId());
			newDiscuss.setDiscussType(discuss.getDiscussType());
			newDiscuss.setTitle(discuss.getTitle());
			newDiscuss.setStatus(discuss.getStatus());
			newDiscuss.setTags(discuss.getTags());
			newDiscuss.setText(discuss.getText());
			newDiscuss.setUserId(discuss.getUserId());
			newDiscuss.setTopicId(discuss.getTopicId());
			// newDiscuss.setSubTopicId(discuss.getSubTopicId());
			discussRepository.save(newDiscuss);
			logger.info("discuss entity edited with ID: "+discuss.getId()+" by User "+Util.getSessionUser(request));
			return responseEntity;
		}
		
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> allDiscuss(HttpServletRequest request) {
		List<DiscussEntity> list = queryDiscuss(null, null, null, null,request);
		return list;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all/{discussType}" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> showDiscussByDiscussType(
			@PathVariable(value = "discussType") String discussType,
			@RequestParam(value = "featured", required = false) Boolean isFeatured,
			@RequestParam(value = "count", required = false, defaultValue = "0") int count,
			HttpServletRequest request) {
		List<DiscussEntity> list = queryDiscuss(discussType, null, null, null,request);
		return list;

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/all" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> allDiscussDiscussTypeAndTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			HttpServletRequest request) {

		List<DiscussEntity> list = queryDiscuss(discussType, topicId, null, null,request);
		return list;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> allDiscussByUser(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			@PathVariable(value = "userId") String userId,
			HttpServletRequest request) {
		List<DiscussEntity> list = queryDiscuss(discussType, topicId, subTopicId, userId,request);
		return list;

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}" }, produces = { "application/json" })
	@ResponseBody
	public List<DiscussEntity> discussByDiscussTypeTopicAndSubTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			HttpServletRequest request) {
		List<DiscussEntity> list = queryDiscuss(discussType, topicId, subTopicId, null,request);
		return list;
	}

	private List<DiscussEntity> queryDiscuss(String discussType, String topicId,
			String subTopicId, String userId,
			HttpServletRequest request) {
		DiscussResponse discussResponse = new DiscussResponse(); 
		try {
			Query q = getQuery(discussType, topicId, subTopicId, userId);
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));
			List<Discuss> list = (List<Discuss>)this.mongoTemplate.find(q,Discuss.class);
			discussResponse.add(list,Util.getSessionUser(request));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return discussResponse.getResponse();
	}

	private String querySize(String discussType, String topicId,
			String subTopicId, String userId) {
		JSONObject obj = new JSONObject();
		try {
			Long articlesCount = this.mongoTemplate.count(
					getQuery("A", topicId, subTopicId, userId), Discuss.class);
			Long questionsCount = this.mongoTemplate.count(
					getQuery("Q", topicId, subTopicId, userId), Discuss.class);
			Long postsCount = this.mongoTemplate.count(
					getQuery("P", topicId, subTopicId, userId), Discuss.class);
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
			String subTopicId, String userId) {
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
		if (null != userId) {
			q.addCriteria(Criteria.where((String) "userId").is((Object) userId));
		}
		return q;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/count/{discussType}/{topicId}/{subTopicId}" }, produces = { "plain/text" })
	@ResponseBody
	public String discussByDiscussTypeTopicAndSubTopicCount(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId) {
		return querySize(discussType, topicId, subTopicId, null);
		
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/show/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public Discuss showDiscuss(
			@PathVariable(value = "discussId") String discussId) {
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
		System.out.println("Inside DELETE");
		discussRepository.delete(discussId);
		ResponseEntity responseEntity = new ResponseEntity(HttpStatus.CREATED);
		System.out.println("responseEntity = " + (Object) responseEntity);
		return responseEntity;
	}

	private Discuss setDiscussBean(Discuss discuss) {
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
			String discussStatus = discuss.getStatus();
			List<String> topicId = discuss.getTopicId();
			String tags = "";
			// List<String> subTopicId = discuss.getSubTopicId();
			// String tags = discuss.getTags() == null ? String.valueOf(topicId)
			// + "," + subTopicId : String.valueOf(discuss.getTags())
			// + "," + topicId + "," + subTopicId;
			int aggrReplyCount = 0;
			return new Discuss(userId, username, discussType, topicId, title,
					text, discussStatus, tags, aggrReplyCount,
					discuss.getDiscussType().equals("A") ? discuss
							.getArticlePhotoFilename() : "",false);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
