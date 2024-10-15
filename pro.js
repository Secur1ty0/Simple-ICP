// ==UserScript==
// @name         SimpICP
// @namespace    http://your.namespace.com
// @version      0.1
// @description  一次图像验证码认证后搜索,格式化获取https://beian.miit.gov.cn/的备案信息,避免翻页获取数据
// @author       Secur1ty0
// @match        https://*/*
// @grant        none
// ==/UserScript==


(function() {
	'use strict';
	var storedRequests = [];
	var requestLookup = [];
	//------------------------------------------------------------------------
	function customAjaxPost(url, requestBody, customHeaders) {
		const requestOptions = {
			method: 'POST',
			headers: new Headers(customHeaders),
			body: requestBody,
			credentials: 'include',
		};
		return fetch(url, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				return data;
			});
	}
	//------------------------------------------------------------------------
	async function useStoredRequests(storedRequests, total, typeFlag) {
		var allres = [];
		var HeadersCopy = Object.assign({}, storedRequests[0].headers);
		let allValues = storedRequests.flatMap(obj => Object.values(obj));
		//
		var url = "https://hlwicpfwc.miit.gov.cn/icpproject_query/api/icpAbbreviateInfo/queryByCondition";
		delete HeadersCopy.method;
		delete HeadersCopy.url;
		var body0 = storedRequests[storedRequests.length - 1].body;
		HeadersCopy.Cookie = storedRequests[storedRequests.length - 1].cookie;
		var n100 = Math.floor(total / 100);
		var remainder = total % 100;
		if (n100 !== 0) {
			alert("总数为" + total + "条,确认批量下载");
			for (let i = 1; i <= n100; i++) {
				let reqbody = JSON.parse(body0);
				reqbody.pageSize = 100;
				const modifiedBody = JSON.stringify(reqbody);
				let res = await customAjaxPost(url, modifiedBody, HeadersCopy)
					.then(response => {
						if (response.code !== 200) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						return response.params.list;
					})
				allres.push(res);
			};
			if (remainder) {
				let reqbody = JSON.parse(body0);
				reqbody.pageSize = remainder;
				const modifiedBody = JSON.stringify(reqbody);
				let res = await customAjaxPost(url, modifiedBody, HeadersCopy)
					.then(response => {
						if (response.code !== 200) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						return response.params.list;
					});
				allres.push(res);
			};
		} else {
			let reqbody = JSON.parse(body0);
			reqbody.pageSize = remainder;
			const modifiedBody = JSON.stringify(reqbody);
			let res = await customAjaxPost(url, modifiedBody, HeadersCopy)
				.then(response => {
					if (response.code !== 200) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					return response.params.list;
				});
			allres.push(res);
		};
		let filename = JSON.parse(body0)
			.unitName + ".csv";
		if (remainder <= 10 && n100 == 0) {
			let mergedArray = [];
			for (let i = 0; i < allres.length; i++) {
				mergedArray = mergedArray.concat(allres[i]);
			};
			var finalarray = [];
			mergedArray.find(item => item.serviceType === 6);
			if (typeFlag == 5) {
				for (let i = 0; i < mergedArray.length; i++) {
					delete mergedArray[i].domainId;
					delete mergedArray[i].serviceId;
					delete mergedArray[i].leaderName;
					delete mergedArray[i].mainId;
					delete mergedArray[i].contentTypeName;
					delete mergedArray[i].limitAccess;
					finalarray = finalarray.concat(mergedArray[i]);
				};
			}
			if (typeFlag == 6) {
				for (let i = 0; i < mergedArray.length; i++) {
					delete mergedArray[i].cityId;
					delete mergedArray[i].countyId;
					delete mergedArray[i].dataId;
					delete mergedArray[i].leaderName;
					delete mergedArray[i].mainId;
					delete mergedArray[i].mainUnitAddress;
					delete mergedArray[i].mainUnitCertNo;
					delete mergedArray[i].mainUnitCertType;
					delete mergedArray[i].natureId;
					delete mergedArray[i].provinceId;
					delete mergedArray[i].serviceId;
					delete mergedArray[i].serviceType;
					delete mergedArray[i].version;
					finalarray = finalarray.concat(mergedArray[i]);
				};
			}
			//创建一个隐藏的 textarea 元素
			const textarea = document.createElement('textarea');
			textarea.style.position = 'fixed';
			textarea.style.opacity = 0;
			const tableText = finalarray.map(row => Object.values(row).join('\t')).join('\n');
			textarea.value = tableText;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			alert('表格数据已成功复制到剪贴板！');
		} else {
			let mergedArray = [];
			for (let i = 0; i < allres.length; i++) {
				mergedArray = mergedArray.concat(allres[i]);
			};
			var finalarray1 = [];
			var csv = "";
			if (typeFlag == 5) {
				for (let i = 0; i < mergedArray.length; i++) {
					delete mergedArray[i].domainId;
					delete mergedArray[i].serviceId;
					delete mergedArray[i].leaderName;
					delete mergedArray[i].mainId;
					delete mergedArray[i].contentTypeName;
					delete mergedArray[i].limitAccess;
					const headers = ['domain', 'mainLicence', 'natureName', 'serviceLicence', 'unitName', 'updateRecordTime'];
					const values = headers.map(header => mergedArray[i][header]);
					csv = csv + values.join(',') + '\n';
					finalarray1 = finalarray1.concat(mergedArray[i]);
				};
			}
			if (typeFlag == 6) {
				for (let i = 0; i < mergedArray.length; i++) {
					delete mergedArray[i].cityId;
					delete mergedArray[i].countyId;
					delete mergedArray[i].dataId;
					delete mergedArray[i].leaderName;
					delete mergedArray[i].mainId;
					delete mergedArray[i].mainUnitAddress;
					delete mergedArray[i].mainUnitCertNo;
					delete mergedArray[i].mainUnitCertType;
					delete mergedArray[i].natureId;
					delete mergedArray[i].provinceId;
					delete mergedArray[i].serviceId;
					delete mergedArray[i].serviceType;
					delete mergedArray[i].version;
					const headers = ['natureName', 'serviceLicence', 'serviceName', 'unitName', 'updateRecordTime'];
					const values = headers.map(header => mergedArray[i][header]);
					csv = csv + values.join(',') + '\n';
					finalarray1 = finalarray1.concat(mergedArray[i]);
				};
			}
			const blob = new Blob(["\uFEFF" + csv], {
				type: 'text/csv;charset=GB18030'
			});
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			alert("下载完成");
		}
	};
	//------------------------------------------------------------------------
	function logRequestAndResponse(requestBody, event, requestId) {
		if (!requestLookup.includes(requestId) && event.type === 'load' && event.target.readyState === 4) {
			requestLookup.push(requestId);
			if (event.target.responseText.includes('total') && event.target.responseText.includes('hasNextPage')) {
				var res = JSON.parse(event.target.responseText);
				if (event.target.responseText.includes("domainId")) {
					const listData = res.params.list
					let total = res.params.total;
					useStoredRequests(storedRequests, total, 5);
				} else {
					const listData = res.params.list
					let total = res.params.total;
					useStoredRequests(storedRequests, total, 6);
				}
			}
		};
	}
	//------------------------------------------------------------------------
	let requestBodies = new WeakMap();
	var flag = 0;
	if (window.XMLHttpRequest) {
		const originalOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
			if (url.includes("icpAbbreviateInfo/queryByCondition")) {
				this._customRequestHeaders = {};
				this._customRequestHeaders.method = method;
				this._customRequestHeaders.url = url;
				this._method = method;
				this._url = url;
				flag = 1;
				var originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
				XMLHttpRequest.prototype._customRequestHeaders = {};
				XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
					this._customRequestHeaders[header] = value;
					return originalSetRequestHeader.apply(this, arguments);
				};
			}
			requestBodies.set(this, null);
			return originalOpen.apply(this, arguments);
		};
		const originalSend = XMLHttpRequest.prototype.send;
		//------------------------------------------------------------------------
		XMLHttpRequest.prototype.send = function(body) {
			if (body.includes("pageSize")) {
				var self = this;
				var headerString = JSON.stringify(self._customRequestHeaders);
				var requestId = `${this._method}:${this._url}:${headerString}:${body}`;
				let requestBody = JSON.parse(body);
				//请求头
				for (var header in self._customRequestHeaders) {
				}
				//------------------------------------------------------------------------
				if (!requestLookup.includes(requestId)) {
					//requestLookup.push(requestId);
					storedRequests.push({
						//创建了一个新的对象，它与 _customRequestHeaders 的内容相同，但是是独立的
						headers: Object.assign({}, self._customRequestHeaders),
						body: body,
						method: self._method,
						url: self._url,
						cookie: document.cookie
					});
				} else {
				}
				//------------------------------------------------------------------------
				try {
					if (requestBody && requestBody.hasOwnProperty('pageSize')) {
						requestBody.pageSize = '10';
						body = JSON.stringify(requestBody);
						requestBodies.set(this, body);
						this.addEventListener('load', function(event) {
							logRequestAndResponse(requestBodies.get(this), event, requestId);
						});
						return originalSend.call(this, body);
					} else {
						requestBodies.set(this, arguments);
						return originalSend.apply(this, arguments);
					}
				} catch (e) {
					console.error('Failed to parse the request body as JSON.', e);
				}
			} else {
				return originalSend.apply(this, arguments);
			}
		}
	};
})();