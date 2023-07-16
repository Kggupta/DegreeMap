-- format description text for model ingestion

UPDATE Course SET description=REPLACE(description,'\r', ' ');
UPDATE Course SET description=REPLACE(description,'\n', ' ');
