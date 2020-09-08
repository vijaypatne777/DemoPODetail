sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, ColumnListItem, Label,FilterOperator) {
	"use strict";

	return Controller.extend("Purchase.PurchaseInfo.controller.View1", {
		onInit: function () {
			var that = this;
			this._mInput = this.byId("mInput");
			this._pModel = this.getOwnerComponent().getModel("CTYPE");
			var oModel = this.getOwnerComponent().getModel("PINFO");
			var jModel =  this.getOwnerComponent().getModel("CTABLE");
			var cBox = this.byId("cbox");
			cBox.setModel(jModel);
			this.getView().setModel(oModel);
			var oFltr = [];
			oFltr.push(new Filter("ConditionApplication", FilterOperator.EQ, "V"));
		    oFltr.push(new Filter("ConditionType",FilterOperator.Contains,"PPR0"));
		    oFltr.push(new Filter("ConditionTable",FilterOperator.Contains,"854"));
			var i;
			var data = [];

			function checkMaterial(arr, val) {
				return arr.some(function (arrval) {
					return arrval.Material === val;
				});
			}

			function setMaterialData() {
				var mModel = new sap.ui.model.json.JSONModel();
				var nData = {
					"rdata": data
				};

				mModel.setData(nData);
				that.getOwnerComponent().setModel(mModel);
			}
//			oModel.read("/A_SlsPrcgCndnRecdValidity", {
//				urlParameters: {
//					$expand: "to_SlsPrcgConditionRecord/to_SlsPrcgCndnRecordScale"
//				},
//* Start For Testing purpose
           	var bFltr = [];
			bFltr.push(new Filter("Material", FilterOperator.Contains, "762336"));
          	var bModel = this.getOwnerComponent().getModel("TBOM");
          	
          				bModel.read("/MaterialBOMItem", {
				 urlParameters: {
					$expand: "to_BillOfMaterial"
				},
//				async: false,
				filters: bFltr,
				success: function (oData, response) {
                alert("Success");
	

				},
				error: function (oerror) {
                alert("error");
	

				}
			});
          	
			oModel.read("/A_SlsPrcgConditionRecord", {
				 urlParameters: {
					$expand: "to_SlsPrcgCndnRecordScale,to_SlsPrcgCndnRecdValidity"
				},
//				async: false,
				filters: oFltr,
				success: function (oData, response) {

					for (i = 0; i < oData.results.length; i++) {

						oModel.getProperty("/to_SlsPrcgConditionRecord");
						var oCon = oData.results[i];
						var cVal = oData.results[i].ConditionRecord;

						if (oData.results[i].to_SlsPrcgConditionRecord.to_SlsPrcgCndnRecordScale.results.length !== 0) {
							var item = {};
							var mat = oData.results[i].Material;
							var mExist = checkMaterial(data, mat);
							if (!mExist) {
								item["Material"] = mat;
								item["PricingScale"] = "Yes";
								data.push(item);
								setMaterialData();
							}
						}

					}

				}
			});

		},
		onFilterMaterial: function (oEvent) {
			var lmat = oEvent.getParameter("query");
			if (lmat) {
				var oFilters = [];
				oFilters.push(new Filter("Material", FilterOperator.Contains, lmat));
				var oTable = this.getView().byId("ConditionScale");
				var oItems = oTable.getBinding("items");
				oItems.filter(oFilters);
			} else {
				var oFilter = null;
				this.byId("ConditionScale").getBinding("items").filter(oFilter);

			}

		},
		onValueHelpRequest: function()
		{
		
			this._helpDialog = sap.ui.xmlfragment("Purchase.PurchaseInfo.view.ValueHelpDialogMaterial", this);
			this.getView().addDependent(this._helpDialog);
			this._helpDialog.getTableAsync().then(function (oTable)
			{
			 	
			 var lblCuse = new Label({text:"{ConditionUsage}"});
			 var colCuse = new sap.ui.table.Column({ label: "Condition Usage", template: lblCuse,width:"8rem"});
			 var lblCa = new Label({text:"{ConditionApplication}"});
			 var colCa = new sap.ui.table.Column({ label: "Condition Application", template: lblCa,width:"8rem"});
			 var lblCt= new Label({text:"{ConditionType}"});
			 var colCt = new sap.ui.table.Column({ label: "Condition Type", template: lblCt,width:"8rem"});
			 oTable.addColumn(colCuse);
			 oTable.addColumn(colCa);
			 oTable.addColumn(colCt);
			 oTable.setModel(this._pModel);
             oTable.bindAggregation("rows" ,{ path: "/A_SlsPricingConditionType" ,  parameters: { select: "ConditionUsage,ConditionApplication,ConditionType"
		                                                                                } });
			this._helpDialog.update();
			}.bind(this));
			this._helpDialog.open();
		},
		
		onValueHelpCancel: function()
		{
			this._helpDialog.close();
		},
			onValueHelpOk: function(oEvent)
		{
			var tokens = oEvent.getParameter("tokens");
			this._cTypes = tokens;
			this._mInput.setTokens(tokens);
			this._helpDialog.close();
		},
		onValueHelpAfterClose: function () {
			this._helpDialog.destroy();
		},
		onFindPriceScale: function(){
			
		}

	});
});