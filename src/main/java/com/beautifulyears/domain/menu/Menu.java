/**
 * 
 */
package com.beautifulyears.domain.menu;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Nitin
 *
 */
@Document(collection = "menu")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Menu {
	@Id
	private String id;
	@DBRef
	private List<Tag> tags = new ArrayList<Tag>();
	private Integer module;
	private String linkedMenuId;
	private String displayMenuName;
	private List<String> ancestorIds = new ArrayList<String>();
	private String parentMenuId;
	@DBRef
	private List<Menu> children = new ArrayList<Menu>();
	private String filterName;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<String> getAncestorIds() {
		return ancestorIds;
	}

	public void setAncestorIds(List<String> ancestorIds) {
		this.ancestorIds = ancestorIds;
	}

	public String getParentMenuId() {
		return parentMenuId;
	}

	public void setParentMenuId(String parentMenuId) {
		this.parentMenuId = parentMenuId;
	}

	public String getFilterName() {
		return filterName;
	}

	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public Integer getModule() {
		return module;
	}

	public void setModule(Integer module) {
		this.module = module;
	}


	public String getDisplayMenuName() {
		return displayMenuName;
	}

	public void setDisplayMenuName(String displayMenuName) {
		this.displayMenuName = displayMenuName;
	}

	public List<Menu> getChildren() {
		return children;
	}

	public void setChildren(List<Menu> children) {
		this.children = children;
	}
	
	

	public String getLinkedMenuId() {
		return linkedMenuId;
	}

	public void setLinkedMenuId(String linkedMenuId) {
		this.linkedMenuId = linkedMenuId;
	}

	@Override
	public boolean equals(Object object) {
		boolean isEqual = false;

		if (object != null && object instanceof Menu) {
			isEqual = (this.getId().equals(((Menu) object).getId()));
		}
		return isEqual;
	}

}