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
					core.addItemRetexture(modDb, itemId, itemData[itemId].BaseItemID, itemData[itemId].BundlePath, config.EnableTradeOffers, config.AddToBots, itemData[itemId].LootWeigthMult);
				}
			}
		}
		
		// deal with edge cases
		// backwards cap
		if (itemConfig["Head Wear"]["AddGearTan_Cap_Backwards"]) {
			core.addItemRetexture(modDb, "AddGearTan_Cap_Backwards", "60a7acf20c5cb24b01346648", "AddGearTan/Headwear/cap_backwards.bundle", false, false, itemData["AddGearTan_Cap_Backwards"].LootWeigthMult);
			core.copyTradeOffers("AddGearTan_Cap_Backwards", "5aa2a7e8e5b5b00016327c16");
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
		
		// debug
		const debug = true;
		
		if (debug) {
			for (const item in database.templates.items) {
				database.templates.items[item]._props.ExaminedByDefault = true;
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
		
		/*
		// Misc Gear //
		core.AddItemRetexture(db, 	"5a16ba61fcdbcb098008728a", "AddGearTan_ops_core_mandible",	 	"AddGearTan/MiscGear/ops_core_mandible.bundle");
		core.AddItemRetexture(db, 	"5ea058e01dbce517f324b3e2", "AddGearTan_tk_heavy_trooper", 		"AddGearTan/MiscGear/tk_heavy_trooper.bundle");
		core.AddItemRetexture(db, 	"5f60b85bbdb8e27dee3dc985", "AddGearTan_caiman_applique", 		"AddGearTan/MiscGear/caiman_applique.bundle");
		core.AddItemRetexture(db, 	"5f60bf4558eff926626a60f2", "AddGearTan_caiman_visor", 			"AddGearTan/MiscGear/caiman_visor.bundle");
		core.AddItemRetexture(db, 	"5a16b7e1fcdbcb00165aa6c9", "AddGearTan_ops_core_visor", 		"AddGearTan/MiscGear/ops_core_visor.bundle");
		core.AddItemRetexture(db, 	"5a16badafcdbcb001865f72d", "AddGearTan_ops_core_side_armor", 	"AddGearTan/MiscGear/ops_core_side_armor.bundle");
		core.AddItemRetexture(db, 	"5f60c076f2bcbb675b00dac2", "AddGearTan_caiman_mandible", 		"AddGearTan/MiscGear/caiman_mandible.bundle");
		core.AddItemRetexture(db, 	"5a16b672fcdbcb001912fa83", "AddGearTan_ops_core_fast_visor", 	"AddGearTan/MiscGear/ops_core_fast_visor.bundle");
		*/
	}
}

module.exports = { mod: new Mod() }