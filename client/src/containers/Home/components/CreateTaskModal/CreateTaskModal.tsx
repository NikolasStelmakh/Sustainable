import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Field, Form, FormRenderProps } from 'react-final-form';
import Button from '@mui/material/Button';
import { formValidation } from './validation';
import { gql, useMutation, useQuery } from '@apollo/client';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

const CREATE_TASK = gql`
  mutation CreateTask(
    $name: String!
    $userId: ID!
    $categorieId: Int!
    $recurringIntervalId: Int
    $startDate: String
  ) {
    createTask(
      name: $name
      userId: $userId
      categorieId: $categorieId
      recurringIntervalId: $recurringIntervalId
      startDate: $startDate
    ) {
      name
    }
  }
`;

const GET_CATEGORIES_LIST = gql`
  query GetCategoriesList {
    staticData {
      categories {
        id
        title
      }
      recurringIntervals {
        id
        name
      }
    }
  }
`;

export type Categorie = {
  id: string;
  title: string;
};

export type RecurringInterval = {
  id: string;
  name: string;
};

type SubmitValues = {
  userId: string;
  name: string;
  categorie: {
    value: number;
    label: string;
  };
  recurringInterval?: {
    value: number;
    label: string;
  };
  startDate?: Date;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const InputField = ({ input, meta, label }: any) => (
  <div style={{ margin: '10px 5px' }}>
    {label ? <label>{label}</label> : null}
    <div>
      <input {...input} />
    </div>
    {meta.touched && meta.error && <span>{meta.error}</span>}
  </div>
);

const SelectField = ({ input, meta, label, ...rest }: any) => {
  return (
    <div style={{ margin: '10px 5px' }}>
      {label ? <label>{label}</label> : null}
      <Select {...input} {...rest} />
      {meta.touched && meta.error && <span>{meta.error}</span>}
    </div>
  );
};

const DatePickerField = ({
  input: { onChange, value },
  meta,
  label,
  ...rest
}: any) => (
  <div style={{ margin: '10px 5px' }}>
    {label ? <label>{label}</label> : null}
    <DatePicker
      selected={value}
      onChange={(date: any) => onChange(date)}
      {...rest}
    />
    {meta.touched && meta.error && <span>{meta.error}</span>}
  </div>
);

export default function CreateTaskModal({
  userId,
  handleClose,
  isOpened,
  initialValues = null,
  refreshTasksList,
}: {
  userId: string;
  handleClose: () => void;
  refreshTasksList: (props: { variables: { userId: string } }) => void;
  isOpened: boolean;
  initialValues?: SubmitValues;
}) {
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [intervalsOptions, setIntervalsOptions] = useState([]);

  const [
    createTask,
    { data: creationResult, loading: creationLoading, error: creationError },
  ] = useMutation(CREATE_TASK);
  const { loading, error, data } = useQuery(GET_CATEGORIES_LIST, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.staticData) {
      setCategoriesOptions(
        data.staticData.categories.map((o: Categorie) => ({
          label: o.title,
          value: o.id,
        })),
      );
      setIntervalsOptions(
        data.staticData.recurringIntervals.map((o: RecurringInterval) => ({
          label: o.name,
          value: o.id,
        })),
      );
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleSubmit = async (values: any, { reset }: any) => {
    await createTask({
      variables: {
        userId: userId,
        name: values.name,
        categorieId: values.categorie.value,
        recurringIntervalId: values.recurringInterval?.value || null,
        startDate: values.startDate || null,
      },
    });
    reset();
    refreshTasksList({
      variables: {
        userId: userId,
      },
    });
    handleClose();
  };

  return (
    <Modal
      open={isOpened}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create New Task
        </Typography>
        <Form
          onSubmit={handleSubmit}
          validate={formValidation.validateForm}
          initialValues={initialValues}
        >
          {(formRenderProps: FormRenderProps) => {
            const {
              handleSubmit,
              modifiedSinceLastSubmit,
              hasSubmitErrors,
              hasValidationErrors,
              pristine,
            } = formRenderProps;

            const isSubmitDisabled =
              loading ||
              creationLoading ||
              ((hasSubmitErrors || creationError) &&
                !modifiedSinceLastSubmit) ||
              hasValidationErrors ||
              pristine;

            return (
              <form onSubmit={handleSubmit}>
                <Field
                  component={InputField}
                  type="text"
                  name="name"
                  placeholder="Enter task name"
                  label="Name"
                />
                <Field
                  name="categorie"
                  label="Categorie"
                  component={SelectField}
                  options={categoriesOptions}
                />
                <Field
                  name="recurringInterval"
                  label="Recurring Interval (optional)"
                  component={SelectField}
                  options={intervalsOptions}
                />
                <Field
                  name="startDate"
                  label="Start Date (optional, default to now)"
                  component={DatePickerField}
                />

                <Button
                  variant="contained"
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  Create
                </Button>
              </form>
            );
          }}
        </Form>
      </Box>
    </Modal>
  );
}
