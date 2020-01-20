const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const baseUrl = 'https://blog.risingstack.com';

async function getHeadings(numberOfPages) {
  try {
    const maxPageNumber = await getMaxPageNumber();

    if( maxPageNumber < numberOfPages ) {
      return {state: false, maxPageNumber: maxPageNumber};

    } else {
      const linkList = await getLinks(numberOfPages);
      return loadHeadings(linkList);
    }

  } catch (error) {
    
  }
}

function getMaxPageNumber() {
  return getHtml(baseUrl)
    .then(($) => {
      const splitedText = $('span.page-number').text().split(' ');
      const pageMaxNumber = +splitedText[splitedText.length-1];

      return pageMaxNumber;
    });
}

function getLinks(numberOfPages) {
  let linkList = [];
  return Promise.allSettled(getLinkPromises(numberOfPages))
    .then((results) => {
      results.forEach((result) => {
        linkList = linkList.concat(result.value);
        console.log(result.status);
      });

      return linkList;
    });
}

function loadHeadings(linkList) {
  let HeadingList = [];
  return Promise.allSettled(getHeadingPromises(linkList))
    .then((results) => {
      results.forEach((result) => {
        HeadingList.push(result.value);
        console.log(result.status);
      });

      return {state: true, content: HeadingList} ;
    });
}

function getLinkPromises(numberOfPages) {
  let linksPromises = [];

  for (let index = 1; index <= numberOfPages; index++) {
    const linksOfPage = getArticleLinks( baseUrl + '/page/' + index);
    linksPromises = linksPromises.concat(linksOfPage);
  }

  return linksPromises; 
}

function getHeadingPromises(linkList) {
  let headingPromises = [];

  linkList.forEach((link) => {
    const url = baseUrl + link;
    headingPromises.push(getHeadingsOfArticle(url));
  });

  return headingPromises;
}

function getArticleLinks(url) {
  return getHtml(url)
    .then(function ($) {
      const listOfLinks = [];
      const html = $('h1[class=post-title] a');

      html.each(function(i, elem) {
        listOfLinks.push($(this).attr('href'));
      });

      return listOfLinks;
    })
}

function getHeadingsOfArticle(url) {
  return getHtml(url)
    .then(function ($) {
      const html = $('.main-inner h1, .main-inner h2, .main-inner h3, .main-inner h4');

      let listOfHeading = [];

      html.each(function(i, elem) {
        let heading = $(this);
        let firstChildOfHeading = heading.children().first();

        if(firstChildOfHeading.is('a')) {
          heading =  firstChildOfHeading;
        }

        listOfHeading.push(heading.html());
      });

      return listOfHeading;
    })
}

function getHtml(url) {
  var options = {
    uri: url,
    transform: function (body) {
        return cheerio.load(body, { decodeEntities: false });
    }
  };

  return requestPromise(options);
}

module.exports.getHeadings = getHeadings;
