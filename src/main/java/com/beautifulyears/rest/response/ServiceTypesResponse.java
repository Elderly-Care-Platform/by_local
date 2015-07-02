package com.beautifulyears.rest.response;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.beautifulyears.domain.ServiceTypes;


public class ServiceTypesResponse implements IResponse {

	private Map<String, ServiceTypesEntity> ServiceTypesMap = new HashMap<String, ServiceTypesEntity>();

	private Map<Integer, ServiceTypesEntity> root;

	public class ServiceTypesEntity {
		private String id;
		private int orderIdx;
		private String name;
		private String slug;
		private String parentId;
		private int childCount;

		private Map<Integer, ServiceTypesEntity> children = new HashMap<Integer, ServiceTypesEntity>();

		public ServiceTypesEntity(ServiceTypes ServiceTypes) {
			id = ServiceTypes.getId();
			name = ServiceTypes.getserviceTypeName();
			slug = ServiceTypes.getSlug();
			parentId = ServiceTypes.getParentId();
			orderIdx = ServiceTypes.getOrderIdx();
		}

		public int getOrderIdx() {
			return orderIdx;
		}

		public void setOrderIdx(int orderIdx) {
			this.orderIdx = orderIdx;
		}

		public String getParentId() {
			return parentId;
		}

		public void setParentId(String parentId) {
			this.parentId = parentId;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getSlug() {
			return slug;
		}

		public void setSlug(String slug) {
			this.slug = slug;
		}

		public Map<Integer, ServiceTypesEntity> getChildren() {
			return children;
		}

		public void setChildren(Map<Integer, ServiceTypesEntity> children) {
			this.children = children;
		}

		public int getChildCount() {
			return childCount;
		}

		public void setChildCount(int childCount) {
			this.childCount = childCount;
		}

	}

	@Override
	public Map<Integer, ServiceTypesEntity> getResponse() {
		root = new HashMap<Integer, ServiceTypesEntity>();
		Iterator it = ServiceTypesMap.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry) it.next();
			ServiceTypesEntity ServiceTypes = (ServiceTypesEntity) pair.getValue();
			Map<Integer, ServiceTypesEntity> childMap = root;
			if (null != ServiceTypes.getParentId()) {
				ServiceTypesEntity parentServiceTypes = ServiceTypesMap.get(ServiceTypes.getParentId());

				childMap = parentServiceTypes.getChildren();
				parentServiceTypes.setChildCount(parentServiceTypes.getChildCount() + 1);

			}
			childMap.put(ServiceTypes.getOrderIdx(), ServiceTypes);
		}
		return root;
	}

	public void addServiceTypes(ServiceTypes ServiceTypes) {
		ServiceTypesEntity ServiceTypesRes = new ServiceTypesEntity(ServiceTypes);
		ServiceTypesMap.put(ServiceTypes.getId(), ServiceTypesRes);
	}

	public void addServiceTypes(List<ServiceTypes> ServiceTypesList) {
		for (Iterator<ServiceTypes> iterator = ServiceTypesList.iterator(); iterator
				.hasNext();) {
			ServiceTypes ServiceTypes = (ServiceTypes) iterator.next();
			ServiceTypesEntity ServiceTypesRes = new ServiceTypesEntity(ServiceTypes);
			ServiceTypesMap.put(ServiceTypes.getId(), ServiceTypesRes);
		}
	}

}
