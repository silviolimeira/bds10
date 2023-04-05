import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { hasAnyRoles } from 'util/auth';
import { useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';

const employeeHardCode: Employee = { // delete
  id: 1,
  name: "Carlos",
  email: "carlos@gmail.com",
  department: {
    id: 1,
    name: "Sales"
  }
};

const List = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<SpringPage<Employee>>();

  const getEmployees = (pageNumber: number) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      params: {
        page: pageNumber,
        size: 12,
      },
      withCredentials: true,
    };

    setIsLoading(true);
    requestBackend(config)
      .then((response) => {
        console.log('Reponse data: ', response.data);
        setPage(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getEmployees(0);
  }, []);


  const handlePageChange = (pageNumber: number) => {
    // to do
  };

  return (
    <div className="container my-4 employee-container">
      <div className="row employee-container-adicionar">
        {hasAnyRoles(['ROLE_ADMIN']) && (
          <Link to="/admin/employees/create">
            <button className="btn btn-primary text-white btn-crud-add">
              ADICIONAR
            </button>
          </Link>
        )}
      </div>
      <div className="row">
        {
          isLoading ? (
            <p>Carregando...</p>
          ) : (
            page?.content.map((employee) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={employee.id}>
                <Link to={`/products/${employee.id}`}>
                  <EmployeeCard employee={employee} />
                </Link>
              </div>
            ))
          )}
      </div>
      <div className="row">
        <Pagination
          forcePage={0}
          pageCount={page ? page.totalPages : 0}
          range={3}
          onChange={getEmployees}
        />
      </div>
    </div>

  )
};

export default List;
