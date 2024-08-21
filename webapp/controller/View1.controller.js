sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("com.techm.crudtable.controller.View1", {
        onInit: function () {
            var odataModel = new sap.ui.model.odata.v2.ODataModel("productModel");
            odataModel.read("/Products",{
                success:function(oData,oResponse){
                    MessageBox.success("Success");
                   
                },
                error: function(oError){
                    MessageBox.error("Error");
                }
            });
            this.getView().setModel(odataModel);
        },
        editData: function(oEvent){
            var that = this;
            var oModel = this.getOwnerComponent().getModel("productModel");
            oModel.setUseBatch(false);
            if(oEvent.getSource().getText() === "edit")
            {
                oEvent.getSource().setText("Submit");
                oEvent.getSource().getParent().getParent().getCells()[2].setEditable(true);
                oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true);
                
            }
            else{
                oEvent.getSource().setText("edit");
                oEvent.getSource().getParent().getParent().getCells()[2].setEditable(false);
                oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);
                var oInput1 = oEvent.getSource().getParent().getParent().getCells()[2].getValue();
                var oInput2 = oEvent.getSource().getParent().getParent().getCells()[3].getValue();
                var Id = oEvent.getSource().getBindingContext("productModel").getProperty("ID");
                var path = "/Products(" + Id + ")"; 
                oModel.update(path,{Price:oInput1,Rating:oInput2},{success:function(odata){
                    that.getView().byId("productTable").getModel().refresh();
                },error:function(oError){
                    console.log(oError);
                }})
            }
        },
        
        createData: function(){
            var ID = this.getView().byId("idinput").getValue();
            var Name = this.getView().byId("nameinput").getValue();
            var price = this.getView().byId("price").getValue();
            var rating = this.getView().byId("rating").getValue();
            var data = {
                ID: parseInt(ID),
                Name: Name,
                Price: price,
                Rating: rating
            };
            var odataModel = this.getOwnerComponent().getModel("productModel");
            odataModel.create("/Products", data, {
                success: function(data, response){
                    MessageBox.success("Data successfully created");
                },
                error: function(error){
                    MessageBox.error("Error while creating the data");
                }
            });
        },
 
        deleteData: function(oEvent){
            var Id = oEvent.getSource().getBindingContext("productModel").getProperty("ID");
            var path = "/Products(" + Id + ")"; 
            var odataModel = this.getOwnerComponent().getModel("productModel");
            odataModel.remove(path,{
                success: function(data,response){
                    MessageBox.success("Deleted data");
                },
                error: function(error){
                    MessageBox.error("Deletion failed");
                }
            })
        },

        onDuplicate:function(oEvent){
            var that = this;
            var oModel=this.getOwnerComponent().getModel("productModel");
            oModel.setUseBatch(false);
            var oDuplicateData = oEvent.getSource().getBindingContext("productModel").getObject();
            oDuplicateData.ID=100+oDuplicateData.ID;
            oModel.create("/Products",oDuplicateData,{
                success:function(odata){
                    //that.onReadAll();
                    that.getView().byId("productTable").getModel().refresh();
                },error:function(oError){
                    console.log(oError);
                }
            })
        }
    });
});
