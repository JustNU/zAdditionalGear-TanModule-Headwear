"use strict";

class Mod
{
	
	postDBLoad(container) 
	{
		// Constants
		const logger = container.resolve("WinstonLogger");
		const database = container.resolve("DatabaseServer").getTables();
		const jsonUtil = container.resolve("JsonUtil");
		const core = container.resolve("JustNUCore");
		const modDb = `user/mods/zAdditionalGear-TanModule-Headwear/db/`;
		const config = require("../config/config.json");
		const itemConfig = require("../config/itemConfig.json");
		const itemData = require("../db/items/itemData.json");
		
		// edge cases
		const edgeCases = ["AddGearTan_Cap_Backwards"];
		
		//add retextures
		for (const categoryId in itemConfig) {
			for (const itemId in itemConfig[categoryId]) {
				// skip edge cases, handle them later
				if (edgeCases.includes(itemId)) {
					continue;
				}
				
				if (itemConfig[categoryId][itemId]) {
					core.addItemRetexture(itemId, itemData[itemId].BaseItemID, itemData[itemId].BundlePath, config.EnableTradeOffers, config.AddToBots, itemData[itemId].LootWeigthMult);
				}
			}
		}
		
		// deal with edge cases
		// backwards cap
		if (itemConfig["Head Wear"]["AddGearTan_Cap_Backwards"]) {
			core.addItemRetexture("AddGearTan_Cap_Backwards", itemData["AddGearTan_Cap_Backwards"].BaseItemID, itemData["AddGearTan_Cap_Backwards"].BundlePath, false, false, itemData["AddGearTan_Cap_Backwards"].LootWeigthMult);
			
			if (config.EnableTradeOffers)
				core.copyTradeOffers("AddGearTan_Cap_Backwards", "5aa2a7e8e5b5b00016327c16");
			if (config.AddToBots)
				core.copyBotItemWeighting("AddGearTan_Cap_Backwards", "5aa2a7e8e5b5b00016327c16");
			
			// change price
			database.templates.prices["AddGearTan_Cap_Backwards"] = 4326;
			
			for (const handbookItemIndex in database.templates.handbook.Items) {
				if (database.templates.handbook.Items[handbookItemIndex].Id === "AddGearTan_Cap_Backwards") {
					database.templates.handbook.Items[handbookItemIndex].Price = 1642;
					break;
				}
			}
		}
		
		// Modify quests
		if (config.EnableQuestChanges) {
			const armoredGear = [
				["AddGearTan_Galvion_Caiman"],
				["AddGearTan_MICH_2001"],
				["AddGearTan_MICH_2002"],
				["AddGearTan_TC_800"],
				["AddGearTan_ACHHC"],
				["AddGearTan_M92"]
			];
			
			// Swift one
			if (database.templates.quests["60e729cf5698ee7b05057439"]) {
				const swiftOneGear = database.templates.quests["60e729cf5698ee7b05057439"].conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive;
				
				database.templates.quests["60e729cf5698ee7b05057439"].conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive = [
					...jsonUtil.clone(swiftOneGear),
					...armoredGear
				];
			}
		}
	}
}

module.exports = { mod: new Mod() }