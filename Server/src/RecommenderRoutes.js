const {Express} = require("express");
const undergradRanks = require("../Recommender/output/undergrad_ranks.json")
const gradRanks = require("../Recommender/output/grad_ranks.json")


/**
 * Registers all user routes
 * 
 * @param {Express} app - The express application
 */
function RecommenderRoutes(app) {

    // get a set of recommended course within the same subject area
    // (This provide results that are more consistent)
    app.route('/Recommender/subject/same').get((req, res) => {

        subject = req.query.subject;
        numberStr = req.query.number;
        numberInt = parseInt(numberStr);
        courseCode = subject + numberStr;
        empty = [];

        if (!(courseCode in gradRanks) && !(courseCode in undergradRanks)) {
            res.json(empty)
        } else {
            
            if (numberInt > 499) {
                ranks = gradRanks[courseCode];
            } else {
                ranks = undergradRanks[courseCode];
            }

            results = []
            for (let index = 0; index < ranks.length; index++ ) {
                currCourse = ranks[index][0];
                currCourseNumber = parseInt(currCourse.replace(/^\D+/g, ''));
                if (currCourse.startsWith(subject) && currCourseNumber >= Math.floor(numberInt/100) * 100) {
                    results.push(ranks[index][0])
                }
            }

            res.json(results)
        }

	})

    // get a set of recommended course from a only different subject areas
    // (This provide results that don't make sense some times)
    app.route('/Recommender/subject/different').get((req, res) => {
        subject = req.query.subject;
        numberStr = req.query.number;
        numberInt = parseInt(numberStr);
        courseCode = subject + numberStr;
        empty = [];

        if (!(courseCode in gradRanks) && !(courseCode in undergradRanks)) {
            console.log("Cancel Course Suggestion")
            res.json(empty)
        } else {
            console.log("Fetching course suggestion")
            if (numberInt > 499) {
                ranks = gradRanks[courseCode];
            } else {
                ranks = undergradRanks[courseCode];
            }

            results = []
            for (let index = 0; index < ranks.length; index++ ) {
                currCourse = ranks[index][0];
                if (!currCourse.startsWith(subject)) {
                    results.push(ranks[index][0])
                }
            }

            res.json(results)
        }

	})

}

module.exports = RecommenderRoutes;