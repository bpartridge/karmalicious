function karmalicious(win, doc, referrer, location) {
  if (!win) return false;
  doc = doc || win.document;
  if (!doc || !doc.body) return false;
  referrer = referrer || doc.referrer;
  location = location || win.location;

  var DIV_ID = 'karmalicious';
  var DIV_ID_2 = 'karmalicious_block';
  var TOP_ROUND = '-moz-border-radius-topleft:20px; -moz-border-radius-topright:20px; ' +
    '-webkit-border-top-left-radius:20px; -webkit-border-top-right-radius:20px;'

  // Calculate viewport height
  var viewportHeight = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight || 480;

  try {
    var sources = {
      "HN comment page": {
        message: "Welcome, Hacker News reader! If you have a HN account, care to upvote or leave a comment?",
        referrerRegex: /^https?:\/\/news.ycombinator.com\/item/i,
        frameSrc: function() {
          return referrer;
        },
        headerColor: '#ff6600', backgroundColor: "#f6f6ef"
      },
      "HN main page": {
        message: "Welcome, Hacker News reader! If you have a HN account, care to upvote?",
        referrerRegex: /^https?:\/\/news.ycombinator.com(\/page2)?/i,
        frameSrc: function() {
          return referrer;
          // return "http://www.hnsearch.com/search#request/submissions&q=%22" + encodeURIComponent(location) + "%22";
        },
        headerColor: '#ff6600', backgroundColor: "#f6f6ef"
      },
      "reddit": {
        message: "Welcome, Redditor! If you see the link you clicked on below, care to leave an upvote or submit?",
        referrerRegex: /^https?:\/\/(www\.)?reddit.com/i,
        frameSrc: function() {
          return "http://www.reddit.com/submit?url=" + encodeURIComponent(location) + "#content";
        },
        headerColor: "#CEE3F8", backgroundColor: "#FFFFFF"
      }
    }

    function removeFrame() {
      var div = doc.getElementById(DIV_ID);
      if (div) div.parentNode.removeChild(div);
      div = doc.getElementById(DIV_ID_2);
      if (div) div.parentNode.removeChild(div);
    }
    removeFrame();

    for (var sourceName in sources) {
      var source = sources[sourceName];
      if (source.referrerRegex.test(referrer)) {

        var frameSrc = source.frameSrc();
        var height = Math.min(300, viewportHeight / 2);

        var div = doc.createElement('div');
        div.id = DIV_ID;
        div.setAttribute('style', 'position:fixed; bottom:0; left:0; height:'+(height+32)+'px; width:100%; ' +
                         'background-color:' + (source.backgroundColor||'#FFFFFF') + '; ' +
                         TOP_ROUND);

        var header = doc.createElement('p');
        header.innerHTML = '<b>' + (source.message || "Welcome!") + "</b> (Click to dismiss this box)";
        header.setAttribute('style', 'width: 100%; text-align: center; height:20px; font-size:14px; padding:6px 0px; margin-bottom:0px; ' +
                            'background-color:' + (source.headerColor||'#FFFFFF') + '; cursor: pointer; ' +
                            TOP_ROUND);
        header.onclick = removeFrame;
        div.appendChild(header);

        var iframe = doc.createElement('iframe');
        iframe.setAttribute('src', frameSrc);
        iframe.setAttribute('style', 'height:'+height+'px; width:100%; border:0;');
        div.appendChild(iframe);

        doc.body.appendChild(div);

        // Add another div to the bottom of the page so we don't cover content.
        var scrollBlockDiv = doc.createElement('div');
        scrollBlockDiv.id = DIV_ID_2;
        scrollBlockDiv.setAttribute('style', 'height:'+(height+20)+'px;');
        doc.body.appendChild(scrollBlockDiv);
        return true;
      }
    }
  }
  catch (error) {
    if (typeof console !== 'undefined')
      console.log("Karmalicious error: " + error);
    return false;
  }
}

if (typeof module !== 'undefined') module.exports = karmalicious;
else karmalicious(typeof window === 'undefined' ? void 0 : window);
