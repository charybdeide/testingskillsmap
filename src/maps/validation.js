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

module.exports = {
  isMapWitMeta: isMapWitMeta,
  isUserLoggedIn: isUserLoggedIn
};