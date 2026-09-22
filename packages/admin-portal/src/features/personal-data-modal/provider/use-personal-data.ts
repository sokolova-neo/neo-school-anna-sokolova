import type { Control, FieldErrors, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { type ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from '@/hooks/use-snackbar';
import { type User, Province } from '../../../types/user';
import { useUpdateUserDetailsMutation } from '../api/use-update-user-details-mutation';

type PersonalDataForm = {
  userId: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  province: Province;
};

const PersonalDataValidationSchema: ZodType<PersonalDataForm> = z
  .object({
    userId: z.string(),
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'First Name cannot be empty' }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: 'Last Name cannot be empty' }),
    preferredName: z.string(),
    province: z.nativeEnum(Province),
  })
  .required();

interface UsePersonalDataResult {
  submit: VoidFunction;
  control: Control<PersonalDataForm, unknown>;
  errors: FieldErrors<PersonalDataForm>;
  handleClose: VoidFunction;
  loading: boolean;
  hasError: boolean;
  provinces: {
    value: string;
    label: string;
  }[];
}

const usePersonalData = ({
  user,
  closeModal,
}: {
  user: User;
  closeModal: VoidFunction;
}): UsePersonalDataResult => {
  const [updateUserDetailsMutation, { loading }] =
    useUpdateUserDetailsMutation();
  const { showSuccess, showError } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PersonalDataForm>({
    mode: 'onBlur',
    resolver: zodResolver(PersonalDataValidationSchema),
    defaultValues: {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      preferredName: user.preferredName ?? '',
      province: user.province,
    },
  });

  const handleClose = () => {
    reset();
    closeModal();
  };

  const onSubmit: SubmitHandler<PersonalDataForm> = async (
    data: PersonalDataForm,
  ) => {
    try {
      await updateUserDetailsMutation({
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            preferredName: data.preferredName,
            province: data.province,
            userId: user.id,
          },
        },
      });

      showSuccess(`${data.firstName}'s personal data updated`);
      closeModal();
    } catch (error) {
      showError(error.message);
    }
  };

  return {
    submit: handleSubmit(onSubmit),
    control,
    errors,
    handleClose,
    loading,
    hasError: Object.keys(errors).length !== 0,
    provinces: Object.entries(Province).map(([value]) => ({
      label: value,
      value,
    })),
  };
};

export { usePersonalData };
