
package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.LinkInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.util.Util;

public class DiscussResponse implements IResponse {

	private List<DiscussEntity> discussArray = new ArrayList<DiscussEntity>();

	@Override
	public List<DiscussEntity> getResponse() {
		// TODO Auto-generated method stub
		return this.discussArray;
	}

	public static class DiscussPage {
		private List<DiscussEntity> content = new ArrayList<DiscussEntity>();
		private boolean lastPage;
		private long number;
<<<<<<< HEAD
=======
		private long size;
		private long total;
>>>>>>> remotes/origin/profileChanges

		public DiscussPage() {
			super();
		}

<<<<<<< HEAD
		public DiscussPage(PageImpl<Discuss> page) {
=======
		public DiscussPage(PageImpl<Discuss> page, User user) {
>>>>>>> remotes/origin/profileChanges
			this.lastPage = page.isLastPage();
			this.number = page.getNumber();
			for (Discuss discuss : page.getContent()) {
				this.content.add(new DiscussEntity(discuss, user));
			}
			this.size = page.getSize();
			this.total = page.getTotal();
		}
		
		

		public long getTotal() {
			return total;
		}

		public void setTotal(long total) {
			this.total = total;
		}

		public long getSize() {
			return size;
		}

		public void setSize(long size) {
			this.size = size;
		}

		public List<DiscussEntity> getContent() {
			return content;
		}

		public void setContent(List<DiscussEntity> content) {
			this.content = content;
		}

		public boolean isLastPage() {
			return lastPage;
		}

		public void setLastPage(boolean lastPage) {
			this.lastPage = lastPage;
		}

		public long getNumber() {
			return number;
		}

		public void setNumber(long number) {
			this.number = number;
		}

	}

	public static class DiscussEntity {
		private String id;
		private String title;
		private Map<String, String> articlePhotoFilename;
		private String userId;
		private String username;
		private String discussType; // Q, P and A (Question, Post and Article)
		private String text;
		private int aggrReplyCount;
		private int directReplyCount;
		private String shortSynopsis;
		private Date createdAt = new Date();
		private List<String> topicId;
		private boolean isLikedByUser = false;
		private int aggrLikeCount = 0;
		private long shareCount = 0;
<<<<<<< HEAD
=======
		private int contentType;
		private LinkInfo linkInfo;
		private boolean isFeatured;
>>>>>>> remotes/origin/profileChanges

		public DiscussEntity(Discuss discuss, User user) {
			this.setId(discuss.getId());
			this.setTitle(discuss.getTitle());
			this.setArticlePhotoFilename(discuss.getArticlePhotoFilename());
			this.setUserId(discuss.getUserId());
			this.setUsername(discuss.getUsername());
			this.setDiscussType(discuss.getDiscussType());
			this.setText(discuss.getText());
<<<<<<< HEAD
			if(null == discuss.getShortSynopsis()){
				Document doc = Jsoup.parse(discuss.getText());
				String text = doc.text();
				if(text.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH){
=======
			if (null == discuss.getShortSynopsis()) {
				Document doc = Jsoup.parse(discuss.getText());
				String text = doc.text();
				if (text.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
>>>>>>> remotes/origin/profileChanges
					discuss.setShortSynopsis(Util.truncateText(text));
				}
			}
			this.setShortSynopsis(discuss.getShortSynopsis());
			this.setAggrReplyCount(discuss.getAggrReplyCount());
			this.setDirectReplyCount(discuss.getDirectReplyCount());
			this.setCreatedAt(discuss.getCreatedAt());
			this.setTopicId(discuss.getTopicId());
			this.setAggrLikeCount(discuss.getLikedBy().size());
			this.setShareCount(discuss.getShareCount());
			if (null != user && discuss.getLikedBy().contains(user.getId())) {
				this.setLikedByUser(true);
			}
			this.setContentType(discuss.getContentType());
			this.setLinkInfo(discuss.getLinkInfo());
			this.setFeatured(discuss.isFeatured());
		}

		public boolean isFeatured() {
			return isFeatured;
		}

		public void setFeatured(boolean isFeatured) {
			this.isFeatured = isFeatured;
		}

		public int getContentType() {
			return contentType;
		}

		public void setContentType(int contentType) {
			this.contentType = contentType;
		}

		public LinkInfo getLinkInfo() {
			return linkInfo;
		}

		public void setLinkInfo(LinkInfo linkInfo) {
			this.linkInfo = linkInfo;
		}

		public String getShortSynopsis() {
			return shortSynopsis;
		}

		public void setShortSynopsis(String shortSynopsis) {
			this.shortSynopsis = shortSynopsis;
		}

		public long getShareCount() {
			return shareCount;
		}

		public void setShareCount(long shareCount) {
			this.shareCount = shareCount;
		}

		public String getShortSynopsis() {
			return shortSynopsis;
		}

		public void setShortSynopsis(String shortSynopsis) {
			this.shortSynopsis = shortSynopsis;
		}

		public long getShareCount() {
			return shareCount;
		}

		public void setShareCount(long shareCount) {
			this.shareCount = shareCount;
		}

		public int getDirectReplyCount() {
			return directReplyCount;
		}

		public void setDirectReplyCount(int directReplyCount) {
			this.directReplyCount = directReplyCount;
		}

		public void setCreatedAt(Date createdAt) {
			this.createdAt = createdAt;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public Map<String, String> getArticlePhotoFilename() {
			return articlePhotoFilename;
		}

		public void setArticlePhotoFilename(
				Map<String, String> articlePhotoFilename) {
			this.articlePhotoFilename = articlePhotoFilename;
		}

		public String getUserId() {
			return userId;
		}

		public void setUserId(String userId) {
			this.userId = userId;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getDiscussType() {
			return discussType;
		}

		public void setDiscussType(String discussType) {
			this.discussType = discussType;
		}

		public String getText() {
			return text;
		}

		public void setText(String text) {
			this.text = text;
		}

		public int getAggrReplyCount() {
			return aggrReplyCount;
		}

		public void setAggrReplyCount(int aggrReplyCount) {
			this.aggrReplyCount = aggrReplyCount;
		}

		public List<String> getTopicId() {
			return topicId;
		}

		public void setTopicId(List<String> topicId) {
			this.topicId = topicId;
		}

		public boolean isLikedByUser() {
			return isLikedByUser;
		}

		public void setLikedByUser(boolean isLikedByUser) {
			this.isLikedByUser = isLikedByUser;
		}

		public int getAggrLikeCount() {
			return aggrLikeCount;
		}

		public void setAggrLikeCount(int aggrLikeCount) {
			this.aggrLikeCount = aggrLikeCount;
		}

		public Date getCreatedAt() {
			return createdAt;
		}

	}

	public void add(List<Discuss> discussArray) {
		for (Discuss discuss : discussArray) {
			this.discussArray.add(new DiscussEntity(discuss, null));
		}
	}

	public void add(Discuss discuss) {
		this.discussArray.add(new DiscussEntity(discuss, null));
	}

	public void add(List<Discuss> discussArray, User user) {
		for (Discuss discuss : discussArray) {
			this.discussArray.add(new DiscussEntity(discuss, user));
		}
	}

	public void add(Discuss discuss, User user) {
		this.discussArray.add(new DiscussEntity(discuss, user));
	}

<<<<<<< HEAD
	public static DiscussPage getPage(PageImpl<Discuss> page) {
		DiscussPage res = new DiscussPage(page);
=======
	public static DiscussPage getPage(PageImpl<Discuss> page, User user) {
		DiscussPage res = new DiscussPage(page, user);
>>>>>>> remotes/origin/profileChanges
		return res;
	}

	public DiscussEntity getDiscussEntity(Discuss discuss, User user) {
		return new DiscussEntity(discuss, user);
	}

}
