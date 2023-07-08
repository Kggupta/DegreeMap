-- Recursive query that gets the pre requisite tree of a given course
WITH RECURSIVE cte_prerequisites AS (
    SELECT *
    FROM PreRequisites
    WHERE subject = 'CS' AND course_number = '492'
    
    UNION ALL
    
    SELECT P.subject, P.course_number, P.pre_requisite_subject, P.pre_requisite_number
    FROM PreRequisites AS P
    INNER JOIN cte_prerequisites AS C
    ON P.subject = C.pre_requisite_subject AND P.course_number = C.pre_requisite_number
)
SELECT *
FROM cte_prerequisites;
