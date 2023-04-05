import { useHistory, useParams } from 'react-router-dom';
import './styles.css';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Employee } from 'types/employee';
import { Department } from 'types/department';
import { useEffect, useState } from 'react';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

type UrlParams = {
  employeeId: string;
};

const Form = () => {
  const { employeeId } = useParams<UrlParams>();

  const isEditing = employeeId !== 'create';

  const history = useHistory();

  const [selectDepartments, setSelectDepartments] = useState<Department[]>([]);

  const handleCancel = () => {
    history.push('/admin/employees')
  };

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/departments',
      withCredentials: true,
    };
    requestBackend(config).then((response) => {
      console.log(response.data);
      setSelectDepartments(response.data);
    });
  }, []);

  const onSubmit = (formData: Employee) => {
    const data = {
      ...formData,
    };

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/employees/${employeeId}` : '/employees',
      data,
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info('Empregado cadastrado com sucesso');
        history.push('/admin/emplyees');
      })
      .catch(() => {
        toast.error('Erro ao cadastrar empregado');
      });
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Employee>();


  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${errors.name ? 'is-invalid' : ''
                    }`}
                  placeholder="Nome do produto"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  type="text"
                  className={`form-control base-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block">{errors.email?.message}</div>
              </div>

            </div>
          </div>
          <div className="margin-bottom-30 ">
            <label htmlFor="department" className="d-none">Departamento</label>
            <Controller
              name="department"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectDepartments}
                  classNamePrefix="product-crud-select"
                  isMulti
                  getOptionLabel={(department: Department) => department.name}
                  getOptionValue={(department: Department) =>
                    String(department.id)
                  }
                  inputId="department"
                />
              )}
            />
            {errors.department && (
              <div className="invalid-feedback d-block">
                Campo obrigatório
              </div>
            )}
          </div>


          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
