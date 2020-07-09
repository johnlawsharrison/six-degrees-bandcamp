var express = require('express');
var https = require('https');
var htmlparser2 = require('htmlparser2');
var router = express.Router();

/* GET a new random musicbrainz-catalogued bandcamp release/track to play */
router.get('/', function(req, res, next) {
  var res_body = {};
  // TODO: stop hardcoding the max value here,
  // TODO: can we use caching to keep track of the count we saw in the previous request?
  var mb_url_search_count = 269526;
  // by choosing a random offset and limit=1,
  // we're essentially choosing a random URL from the full results
  var mb_search_offset = Math.floor(Math.random() * mb_url_search_count);
  const mb_limit = 1;
  const options = {
    hostname: 'musicbrainz.org',
    path: `/ws/2/url/?query=bandcamp&fmt=json&offset=${mb_search_offset}&limit=${mb_limit}`,
    headers: { 'User-Agent': 'SixDegreesBandcamp/0.0.0' }
  };
  // TODO: learn about axios and use async/await for this data fetching
  // Fetch a random bandcamp link known to MusicBrainz
  https.get(options, mb_resp => {
    let body = '';
    mb_resp.on('data', chunk => {
      body += chunk;
    });
    mb_resp.on('end', () => {
      mb_body = JSON.parse(body);
      const mb_url_relation = mb_body['urls'][0];
      const bandcamp_url = mb_url_relation['resource'];
      https.get(bandcamp_url, bc_resp => {
        var parser = new htmlparser2.Parser(
          {
            onopentag(name, attribs) {
              if (name === 'div' &&  attribs.id === 'pagedata') {
                var dataBlob = JSON.parse(attribs['data-blob']);
                // TODO: if these are both null, we probably want to try another URL instead
                res_body = {
                  ...mb_url_relation,
                  'bandcampTrackId': dataBlob['track_id'] || null,
                  'bandcampAlbumId': dataBlob['album_id'] || null
                };
                // stop parsing the Bandcamp HTML; there isn't more data we need
                parser.end();
              }
            }
          },
          { decodeEntities: true }
        );
        bc_resp.on('data', data => {
          parser.write(data);
        });
        bc_resp.on('end', () => {
          parser.end();
          res.send(res_body);
        });
      })
    })
  })
});

module.exports = router;
