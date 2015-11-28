function isMapWitMeta(payload)
{
  if (Object.keys(payload).length === 0) return false;
  return true;
}

function isUserLoggedIn(request)
{
   var session = request.session.get('session');
   if(!session) return false;
   if(!session.user) return false;
   return true;
}

function areSkillsNotEmpty(mapData) {
   var status = true; 
   mapData.forEach(function(element) {
     element.skills.forEach(function(skill) {
        if(!skill || skill === "") status = false;
     }, this);
   }, this);
   return status;
}

module.exports = {
  isMapWitMeta: isMapWitMeta,
  isUserLoggedIn: isUserLoggedIn,
  areSkillsNotEmpty: areSkillsNotEmpty
  
};