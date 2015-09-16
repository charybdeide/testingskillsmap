function getSkills(mapData) {
  var list = [];
  var mapLength = mapData.length;

  for(var i = 0; i < mapLength; i++)
  {
    if(mapData[i].skills)
    {
      var skillsNumber = mapData[i].skills.length;
      for(var j = 0; j < skillsNumber; j++) {
        if(mapData[i].skills[j] !== '') {
          list.push(mapData[i].skills[j]);
        }
      }
    }
  }
  return list;
}


function previewMaps(maps) {
  var previews = [];

  for(var i in maps) {
    var categoriesList = [];
    for(var j in maps[i].map.data) {
      var catWidth;
      var catName;

      if (maps[i].map.data[j].category || (maps[i].map.data[j].category == "" && maps[i].map.data[j].skills != ""))
      {
        catName = maps[i].map.data[j].category;
        var skillsCount = maps[i].map.data[j].skills.length;
        catWidth = Math.min(skillsCount * 2, 90);
        categoriesList.push({
          width: catWidth,
          name: catName,
          zindex: 100-catWidth
        });
      }
    }
    previews.push({
        id: maps[i]._id,
        name: maps[i].map.name,
        categories: categoriesList
      });
  }
  return previews;
}

module.exports = {
  getSkills: getSkills,
  previewMaps: previewMaps
};
