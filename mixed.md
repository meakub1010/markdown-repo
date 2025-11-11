### Find the second highest salary
```sql
select max(salary) from emp
where salary not in(
    select max(salary) from emp
);

-- apply ranking
select salary from (
select 
salary,
dense_rank() over(order by salary desc) as r
from emp ) t
where r = 2
```
