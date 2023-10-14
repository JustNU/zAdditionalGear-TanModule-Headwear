"use strict";

class CustomItems {
	static handleCustomItems(database, core, config, itemConfig, itemData)
	{
		if (itemConfig["Head Wear"]["AddGearTan_Cap_Backwards"]) {
			core.addItemRetexture("AddGearTan_Cap_Backwards", itemData["AddGearTan_Cap_Backwards"].BaseItemID, itemData["AddGearTan_Cap_Backwards"].BundlePath, false, false, itemData["AddGearTan_Cap_Backwards"].LootWeigthMult);
			
			
			if (config.AddToBots)
				core.copyBotItemWeighting("AddGearTan_Cap_Backwards", "5aa2a7e8e5b5b00016327c16", itemData["AddGearTan_Cap_Backwards"].LootWeigthMult);
			
			// find handbook entry
			const dbItemHandbook = database.templates.handbook.Items.find((item) => {return item.Id === "AddGearTan_Cap_Backwards"});
			
			// add trade offer
			if (config.EnableTradeOffers)
				core.createTraderOffer("AddGearTan_Cap_Backwards", "5ac3b934156ae10c4430e83c", "5449016a4bdc2d6f028b456f", dbItemHandbook.Price, 1);
		}
	}
}

module.exports = CustomItems;