function getSkills(mapData) {
	var list = [];
	var mapLength = mapData.length;
        for(var i = 0; i < mapLength; i++)
        {
          if(mapData[i].skills)
          {
            var skillsNumber = mapData[i].skills.length;
            for(var j = 0; j < skillsNumber; j++)
              if(mapData[i].skills[j] != '')
                list.push(mapData[i].skills[j]);  
          }
          
        }
    return list;
}

module.exports = {
  getSkills: getSkills
};
