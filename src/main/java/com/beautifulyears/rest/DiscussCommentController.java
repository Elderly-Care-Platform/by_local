package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.Util;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussComment;
import com.beautifulyears.repository.DiscussCommentRepository;

/**
 * The REST based service for managing "comment"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping("/comment")
public class DiscussCommentController {
	private Logger logger = LoggerFactory
			.getLogger(DiscussCommentController.class);

	private DiscussCommentRepository discussCommentRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public DiscussCommentController(
			DiscussCommentRepository discussCommentRepository,
			MongoTemplate mongoTemplate) {
		this.discussCommentRepository = discussCommentRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<DiscussComment> allDiscussComment(
			@RequestParam(defaultValue = "") String discussId,
			@RequestParam(defaultValue = "") String parentId,
			@RequestParam(defaultValue = "") String ancestorId,
			@RequestParam(defaultValue = "") String id) {
		List<DiscussComment> result = new ArrayList<DiscussComment>();
		boolean buildTree = false;
		Query q = new Query();
		if (!Util.isEmpty(discussId)) { // top level
			q = new BasicQuery("{ $where : 'this.parentId == this._id' }");
			q.addCriteria(Criteria.where("discussId").is(discussId));
		} else if (!Util.isEmpty(parentId) && Util.isEmpty(ancestorId)) {
			// looking for children
			q = new BasicQuery("{ $where : 'this.parentId != this._id' }");
			q.addCriteria(Criteria.where("parentId").is(parentId));
		} else if (!Util.isEmpty(parentId) && !Util.isEmpty(ancestorId)) {
			// looking for tree
			if (parentId.equals(ancestorId)) {
				// tree from some discuss -- This could be a LARGE amount of
				// data
				q = new Query();
				q.addCriteria(Criteria.where("ancestorId").is(ancestorId));

			} else {
				// tree from some comment node
				DiscussComment rootDiscussComment = mongoTemplate.findOne(
						new Query().addCriteria(Criteria.where("id").is(
								parentId)), DiscussComment.class);
				if (rootDiscussComment != null) {
					q.addCriteria(Criteria.where("ancestorId").is(ancestorId));
					q.addCriteria(Criteria.where("ancestorOffset").gt(
							rootDiscussComment == null ? 0 : rootDiscussComment
									.getAncestorOffset()));
					buildTree = true;
				} else {
					q = new Query();
				}
			}
			buildTree = true;
		} else if (!Util.isEmpty(id)) {// instance
			q.addCriteria(Criteria.where("id").is(id));
		}
		if (!q.equals(new Query())) {
			q.with(new Sort(Sort.Direction.ASC, "ancestorOffset"));
			q.with(new Sort(Sort.Direction.DESC, "createdAt"));
			logger.info(q.toString());
			result = mongoTemplate.find(q, DiscussComment.class);
		}
		if (buildTree) {
			result = buildTree(result);
		}
		return result;
	}

	private List<DiscussComment> buildTree(List<DiscussComment> result) {
		// The list contains a flattened tree .. convert Back to a tree.
		Map<String, DiscussComment> nodesMap = new HashMap<String, DiscussComment>(
				25);
		List<DiscussComment> tree = new ArrayList<DiscussComment>();
		int startOffset = result.get(0).getAncestorOffset();
		DiscussComment curDiscussComment = null;
		DiscussComment curParentDiscussComment = null;
		Iterator<DiscussComment> it = result.iterator();
		while (it.hasNext()) {
			curDiscussComment = it.next();
			nodesMap.put(curDiscussComment.getId(), curDiscussComment);
			if (curDiscussComment.getAncestorOffset() == startOffset) {
				tree.add(curDiscussComment);
				nodesMap.put(curDiscussComment.getId(), curDiscussComment);
			} else {
				curParentDiscussComment = nodesMap.get(curDiscussComment
						.getParentId());
				if (curParentDiscussComment != null) {
					curParentDiscussComment.getChildren()
							.add(curDiscussComment);
				}
			}

		}

		return tree;
	}

	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public DiscussComment submitDiscussComment(
			@RequestBody DiscussComment discussComment) {
		System.out.println("Dicuss comment :: "
				+ discussComment.getDiscussCommenContent());
		// JR TBD
		// set the userId from session .. not checked later

		// This is either a dicussComment on a discuss or a comment on a
		// dicussComment

		System.out.println("parent id = " + discussComment.getParentId());
		System.out.println("discuss id = " + discussComment.getParentId());
		DiscussComment discussCommentToReturn = null;
		if (!Util.isEmpty(discussComment.getParentId())) { // comment on comment
			System.out.println("*** about to create comment on comment....");
			discussCommentToReturn = saveDiscussCommentOnComment(discussComment);
		} else if (!Util.isEmpty(discussComment.getDiscussId())) {// comment on
			System.out.println("*** about to create comment on discuss....");
			discussCommentToReturn = saveDiscussCommentOnDiscuss(discussComment);
		} else { // No idea what you are trying

		}
		return discussCommentToReturn;
	}

	public DiscussComment saveDiscussCommentOnComment(
			DiscussComment discussComment) {
		DiscussComment preparedDiscussComment = null;
		DiscussComment discussCommentBeingCommentedOn = mongoTemplate.findOne(
				new Query().addCriteria(Criteria.where("id").is(
						discussComment.getParentId())), DiscussComment.class);
		if (discussCommentBeingCommentedOn != null) {
			preparedDiscussComment = new DiscussComment();
			preparedDiscussComment.setAncestorId(discussCommentBeingCommentedOn
					.getAncestorId());
			preparedDiscussComment
					.setAncestorOffset(discussCommentBeingCommentedOn
							.getAncestorOffset() + 1);
			preparedDiscussComment.setCreatedAt(new Date());
			preparedDiscussComment.setDescendentCount(0);
			discussCommentBeingCommentedOn
					.setDescendentCount(discussCommentBeingCommentedOn
							.getDescendentCount() + 1);
			preparedDiscussComment.setDiscussCommenContent(discussComment
					.getDiscussCommenContent());
			preparedDiscussComment.setDiscussCommentCommentCount(0);
			discussCommentBeingCommentedOn
					.setDiscussCommentCommentCount(discussCommentBeingCommentedOn
							.getDiscussCommentCommentCount() + 1);
			preparedDiscussComment.setDiscussCommentTitle(discussComment
					.getDiscussCommentTitle());
			preparedDiscussComment.setDiscussId(discussCommentBeingCommentedOn
					.getDiscussId());
			preparedDiscussComment.setParentId(discussCommentBeingCommentedOn
					.getId());
			preparedDiscussComment.setSiblingPosition(preparedDiscussComment
					.getDiscussCommentCommentCount());
			preparedDiscussComment.setSubTopicId(discussCommentBeingCommentedOn
					.getSubTopicId());
			preparedDiscussComment.setTopicId(discussCommentBeingCommentedOn
					.getTopicId());
			preparedDiscussComment.setUserId(discussComment.getUserId());
			try {
				mongoTemplate.save(preparedDiscussComment);
				if (preparedDiscussComment.getId() != null) {// saved
					mongoTemplate.save(discussCommentBeingCommentedOn);
				}
			} catch (Exception e) {
				logger.error("Error trying to create discuss_comment"
						+ e.getMessage());
				preparedDiscussComment = null;
			}
		}
		return preparedDiscussComment;
	}

	public DiscussComment saveDiscussCommentOnDiscuss(
			DiscussComment discussComment) {
		DiscussComment preparedDiscussComment = null;
		Discuss discussBeingCommented = mongoTemplate.findOne(
				new Query().addCriteria(Criteria.where("id").is(
						discussComment.getDiscussId())), Discuss.class);
		if (discussBeingCommented != null) {
			preparedDiscussComment = new DiscussComment();
			preparedDiscussComment.setAncestorId(discussBeingCommented.getId());
			preparedDiscussComment.setAncestorOffset(0);
			preparedDiscussComment.setCreatedAt(new Date());
			preparedDiscussComment.setDescendentCount(0);
			preparedDiscussComment.setDiscussCommenContent(discussComment
					.getDiscussCommenContent());
			preparedDiscussComment.setDiscussCommentCommentCount(0);
			preparedDiscussComment.setDiscussCommentTitle(discussComment
					.getDiscussCommentTitle());
			preparedDiscussComment.setDiscussId(discussBeingCommented.getId());
			// preparedDiscussComment.setParentId(discussBeingCommented.getId());
			// // set to Self
			preparedDiscussComment.setSiblingPosition(0);
			preparedDiscussComment.setSubTopicId(discussBeingCommented
					.getSubTopicId());
			preparedDiscussComment.setTopicId(discussBeingCommented
					.getTopicId());
			preparedDiscussComment.setUserId(discussComment.getUserId());
			try {
				mongoTemplate.save(preparedDiscussComment);
				if (preparedDiscussComment.getId() != null) {// saved
					preparedDiscussComment.setParentId(preparedDiscussComment
							.getId());
					mongoTemplate.save(preparedDiscussComment);
				}
			} catch (Exception e) {
				logger.error("Error trying to create discuss_comment"
						+ e.getMessage());
				preparedDiscussComment = null;
			}
		}
		return preparedDiscussComment;
	}
}
