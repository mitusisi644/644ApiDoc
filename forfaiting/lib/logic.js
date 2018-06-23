/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Place an order for a vehicle
 * @param {org.zjhl.network.CreateLocAsset} createLocAsset - the PlaceOrder transaction
 * @transaction
 */
function createLocAsset(locAsset) {
    console.log('asset')
    console.log(locAsset)

    var factory = getFactory();
    var namespace = 'org.zjhl.network';  
    var newLoc = factory.newResource(namespace, 'LocAsset', locAsset.assetDBId);
    newLoc.locStatus = 'SUBMITTED';
    newLoc.locDetails = locAsset.locDetails;
    newLoc.owner = factory.newRelationship(namespace, 'Agency', locAsset.owner.getIdentifier());
    // save the order
  return getAssetRegistry(newLoc.getFullyQualifiedType())
  .then(function (assetRegistry) {
        console.log(assetRegistry)        
        return assetRegistry.add(newLoc);
  });
}


 /**
 * Place an order for a vehicle
 * @param {org.zjhl.network.UpdateLocAsset} updateLocAsset - the Update Loc Asset statues transaction
 * @transaction
 */
function updateLocAsset(locRequest) {
  //console.log('request')
  //console.log(locRequest)
  
  var factory = getFactory();
  var namespace = 'org.zjhl.network';  
  
  return getAssetRegistry(namespace + '.LocAsset')
  .then(function (locAssetRegistry) {
    
    if(locRequest.locStatus === 'SETTLED'){
      return locAssetRegistry.get(locRequest.locAsset.assetDBId)
      .then(function(locAsset){
        locAsset.owner = factory.newRelationship(namespace, 'Agency', locRequest.owner.getIdentifier());
        locAsset.locStatus = 'SETTLED';
        return locAssetRegistry.update(locAsset)
      }) 
    } else {
      return locAssetRegistry.get(locRequest.locAsset.assetDBId)
      .then(function(locAsset){
        locAsset.locStatus = locRequest.newLocStatus;
        return locAssetRegistry.update(locAsset)
      })
    }
    
  });
}




