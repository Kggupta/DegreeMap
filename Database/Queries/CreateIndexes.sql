CREATE INDEX idx_section_time_range ON Section (start_time, end_time);

CREATE INDEX idx_deadlines_due_date ON Deadlines (due_date);

CREATE INDEX idx_grade ON Takes (grade);