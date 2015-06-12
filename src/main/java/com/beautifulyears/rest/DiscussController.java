package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

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
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.custom.DiscussRepositoryCustom;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping(value = { "/discuss" })
public class DiscussController {
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
	public ResponseEntity<Void> submitDiscuss(@RequestBody Discuss discuss) {
		if (discuss == null || discuss.getId() == null
				|| discuss.getId().equals("")) {
			System.out.println("NEW DISCUSS");
			Discuss discussWithExtractedInformation = this
					.setDiscussBean(discuss);
			
			discussRepository.save(discussWithExtractedInformation);
			
			ResponseEntity responseEntity = new ResponseEntity(
					HttpStatus.CREATED);
			
			System.out.println("responseEntity = " + (Object) responseEntity);
			return responseEntity;
		}
		System.out.println("EDIT DISCUSS");
		Discuss newDiscuss = this.getDiscuss(discuss.getId());
		newDiscuss.setDiscussType(discuss.getDiscussType());
		newDiscuss.setTitle(discuss.getTitle());
		newDiscuss.setStatus(discuss.getStatus());
		newDiscuss.setTags(discuss.getTags());
		newDiscuss.setText(discuss.getText());
		newDiscuss.setUserId(discuss.getUserId());
		newDiscuss.setTopicId(discuss.getTopicId());
//		newDiscuss.setSubTopicId(discuss.getSubTopicId());
		discussRepository.save(newDiscuss);
		ResponseEntity responseEntity = new ResponseEntity(HttpStatus.CREATED);
		System.out.println("responseEntity = " + (Object) responseEntity);
		return responseEntity;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> allDiscuss() {
		System.out.println("show ALL discuss of ALL discuss types");
		Query q = new Query();
		q.addCriteria(Criteria.where((String) "discussType").in(new Object[]{ "A", "Q","P" }));
		q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));
		List list = this.mongoTemplate.find(q, (Class) Discuss.class);
		return list;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all/{discussType}" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> showDiscussByDiscussType(
			@PathVariable(value = "discussType") String discussType,
			@RequestParam(value = "featured", required = false) Boolean isFeatured,
			@RequestParam(value = "count", required = false, defaultValue = "0") int count) {
		try {
			System.out.println("show ALL discuss of discuss type = "
					+ discussType + "with isFeatured = " + isFeatured + "count = " + count);
			Query q = new Query();
			if (!discussType.equalsIgnoreCase("All")) {
				q.addCriteria(Criteria.where((String) "discussType").is(
						(String) discussType));
			}else{
				q.addCriteria(Criteria.where((String) "discussType").in(new Object[]{ "A", "Q","P" }));
			}
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" })).limit(count);
			List<Discuss> list = this.mongoTemplate.find(q, (Class) Discuss.class);
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/all" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> allDiscussDiscussTypeAndTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId) {

		try {
			System.out.println("show discuss of topic id = " + topicId
					+ " :: discuss type = " + discussType);

			Query q = new Query();
			if (!discussType.equalsIgnoreCase("All")) {
				q.addCriteria(Criteria.where("topicId")
						.in(topicId).and("discussType")
						.is((Object) discussType));
			} else {
				q.addCriteria(Criteria.where("topicId").in(topicId));
			}
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));
			List list = this.mongoTemplate.find(q, (Class) Discuss.class);

			System.out.println("list size = " + list.size());
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> allDiscussByUser(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			@PathVariable(value = "userId") String userId) {
		try {
			System.out.println("show discuss of user id = " + userId
					+ " :: discuss type = " + discussType + " :: topicId = "
					+ topicId + " :: sub topic id = " + subTopicId);
			Query q = new Query();
			if (!discussType.equalsIgnoreCase("All")) {
				q.addCriteria(Criteria.where((String) "userId")
						.is((Object) userId).and("discussType")
						.is((Object) discussType).and("topicId")
						.in(topicId).and("subTopicId")
						.in(subTopicId));
			} else {
				q.addCriteria(Criteria.where((String) "userId")
						.is((Object) userId).and("topicId")
						.in(topicId).and("subTopicId")
						.in(subTopicId));
			}
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));
			List list = this.mongoTemplate.find(q, (Class) Discuss.class);
			if (list != null) {
				System.out.println("size = " + list.size());
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}" }, produces = { "application/json" })
	@ResponseBody
	public List<Discuss> discussByDiscussTypeTopicAndSubTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId) {
		try {
			System.out.println("show discuss of topic id = " + topicId
					+ " :: sub topic id = " + subTopicId);
			Query q = new Query();
			if (!discussType.equalsIgnoreCase("All")) {
				q.addCriteria(Criteria.where("topicId")
						.in(new Object[] {subTopicId}).and("discussType")
						.is((Object) discussType));
			} else {
				q.addCriteria(Criteria.where("topicId")
						.in(new Object[] {subTopicId}));
			}
			q.with(new Sort(Sort.Direction.DESC, new String[] { "createdAt" }));
			List list = this.mongoTemplate.find(q, (Class) Discuss.class);
			if (list != null) {
				System.out.println("size = " + list.size());
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<Discuss>();
		}
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/count/{discussType}/{topicId}/{subTopicId}" }, produces = { "plain/text" })
	@ResponseBody
	public String discussByDiscussTypeTopicAndSubTopicCount(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId) {
		try {

			// Discuss All
			if (topicId.equalsIgnoreCase("list")) {
				System.out.println("Discuss All Counts");
				// A
				Query q = new Query();
				q.addCriteria(Criteria.where((String) "discussType").is(
						(Object) "A"));
				List listA = this.mongoTemplate.find(q, (Class) Discuss.class);
				if (listA != null) {
					System.out.println("size A = " + listA.size());
				}

				// P
				q = new Query();
				q.addCriteria(Criteria.where((String) "discussType").is(
						(Object) "P"));
				List listP = this.mongoTemplate.find(q, (Class) Discuss.class);
				if (listP != null) {
					System.out.println("size P = " + listP.size());
				}

				// Q
				q = new Query();
				q.addCriteria(Criteria.where((String) "discussType").is(
						(Object) "Q"));
				List listQ = this.mongoTemplate.find(q, (Class) Discuss.class);
				if (listQ != null) {
					System.out.println("size Q = " + listQ.size());
				}

				int total = listA.size() + listP.size() + listQ.size();

				/*
				return listA != null && listP != null && listQ != null ? listA
						.size()
						+ ","
						+ listP.size()
						+ ","
						+ listQ.size()
						+ ","
						+ total + "" : "0,0,0,0";
						*/
				JSONObject obj = new JSONObject();

			      obj.put("a", new Integer(listA.size()));
			      obj.put("p", new Integer(listP.size()));
			      obj.put("q", new Integer(listQ.size()));
			      obj.put("z", new Integer(total));
			     return obj.toString();
			}
			// All sub topics of a given topic
			else if (subTopicId.equalsIgnoreCase("all")
					&& !topicId.equalsIgnoreCase("list")) {
				// A
				Query q = new Query();
				q.addCriteria(Criteria.where("topicId")
						.in(new Object[] {topicId}).and("discussType")
						.is((Object) "A"));
				List listA = this.mongoTemplate.find(q, (Class) Discuss.class);
				if (listA != null) {
					System.out.println("size A = " + listA.size());
				}

				// P
				q = new Query();
				q.addCriteria(Criteria.where("topicId")
						.is(new Object[] {topicId}).and("discussType")
						.is((Object) "P"));
				List listP = this.mongoTemplate.find(q, (Class) Discuss.class);
				if (listP != null) {
					System.out.println("size P = " + listP.size());
				}

				// Q
				q = new Query();
				q.addCriteria(Criteria.where("topicId")
						.is(new Object[] {topicId}).and("discussType")
						.is((Object) "Q"));
				List listQ = this.mongoTemplate.find(q, (Class) Discuss.class);
				if (listQ != null) {
					System.out.println("size Q = " + listQ.size());
				}

				int total = listA.size() + listP.size() + listQ.size();

				/*
				return listA != null && listP != null && listQ != null ? listA
						.size()
						+ ","
						+ listP.size()
						+ ","
						+ listQ.size()
						+ ","
						+ total + "" : "0,0,0,0";
				*/
				JSONObject obj = new JSONObject();

			      obj.put("a", new Integer(listA.size()));
			      obj.put("p", new Integer(listP.size()));
			      obj.put("q", new Integer(listQ.size()));
			      obj.put("z", new Integer(total));
			     return obj.toString();
			     
			} else if (!topicId.equalsIgnoreCase("list")
					&& !subTopicId.equalsIgnoreCase("all")) {

				if (!discussType.equalsIgnoreCase("All")) {
					System.out.println("show discuss count of topic id = "
							+ topicId + " :: sub topic id = " + subTopicId);
					Query q = new Query();
					q.addCriteria(Criteria.where((String) "topicId")
							.is(new Object[] {subTopicId}).and("discussType")
							.is((Object) discussType));
					List list = this.mongoTemplate.find(q,
							(Class) Discuss.class);
					if (list != null) {
						System.out.println("size = " + list.size());
					}
					Integer rr = list != null ? new Integer(list.size())
							: new Integer(0);
					return list != null ? list.size() + "" : "0";
				} else {
					System.out.println("show discuss count of all the types");

					// A
					Query q = new Query();
					q.addCriteria(Criteria.where("topicId")
							.in(new Object[] {subTopicId}).and("discussType")
							.is((Object) "A"));
					List listA = this.mongoTemplate.find(q,
							(Class) Discuss.class);
					if (listA != null) {
						System.out.println("size A = " + listA.size());
					}

					// P
					q = new Query();
					q.addCriteria(Criteria.where("topicId")
							.in(new Object[] {subTopicId}).and("discussType")
							.is((Object) "P"));
					List listP = this.mongoTemplate.find(q,
							(Class) Discuss.class);
					if (listP != null) {
						System.out.println("size P = " + listP.size());
					}

					// Q
					q = new Query();
					q.addCriteria((Criteria.where("topicId")
							.in(new Object[] {subTopicId}).and("discussType")
							.is((Object) "Q")));
					List listQ = this.mongoTemplate.find(q,
							(Class) Discuss.class);
					if (listQ != null) {
						System.out.println("size Q = " + listQ.size());
					}

					int total = listA.size() + listP.size() + listQ.size();

					/*
					 * return listA != null && listP != null && listQ != null ?
					 * listA .size() + "," + listP.size() + "," + listQ.size() +
					 * "," + total + "" : "0,0,0,0";
					 */
					
					JSONObject obj = new JSONObject();

				      obj.put("a", new Integer(listA.size()));
				      obj.put("p", new Integer(listP.size()));
				      obj.put("q", new Integer(listQ.size()));
				      obj.put("z", new Integer(total));
				     return obj.toString();
				}
			} else {
				JSONObject obj = new JSONObject();

			      obj.put("a", new Integer(0));
			      obj.put("p", new Integer(0));
			      obj.put("q", new Integer(0));
			      obj.put("z", new Integer(0));
			     return obj.toString();
			}
			// return new JSONObject().put("size", (Object)
			// rr.toString()).toString();
		} catch (Exception e) {
			e.printStackTrace();
			JSONObject obj = new JSONObject();

		      obj.put("a", new Integer(0));
		      obj.put("p", new Integer(0));
		      obj.put("q", new Integer(0));
		      obj.put("z", new Integer(0));
		     return obj.toString();
		}
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
	public Discuss getDiscuss(
			@PathVariable(value = "discussId") String discussId) {
		Discuss discuss = (Discuss) discussRepository.findOne(discussId);
		if (discuss == null) {
			throw new DiscussNotFoundException(discussId);
		}
		return discuss;
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
	public ResponseEntity<Void> deletePost(
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
//			List<String> subTopicId = discuss.getSubTopicId();
//			String tags = discuss.getTags() == null ? String.valueOf(topicId)
//					+ "," + subTopicId : String.valueOf(discuss.getTags())
//					+ "," + topicId + "," + subTopicId;
			int aggrReplyCount = 0;
			int aggrLikeCount = 0;
			return new Discuss(userId, username, discussType, topicId,
					 title, text, discussStatus, tags,
					aggrReplyCount, aggrLikeCount, discuss.getDiscussType().equals("A") ? discuss.getArticlePhotoFilename() : "");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
