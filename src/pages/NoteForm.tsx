import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useNotes } from "../hooks/useNotes";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import { Save, ArrowLeft } from "lucide-react";

const schema = yup.object({
  nombre: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  contenido: yup
    .string()
    .max(5000, "Content must be less than 5000 characters"),
  recursoActivo: yup.boolean(),
  tagIds: yup.string().optional(),
});

type FormData = {
  nombre: string;
  contenido: string;
  recursoActivo: boolean;
  tagIds: string;
};

export const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { getNote, createNote, updateNote, loading } = useNotes();
  const { toasts, showToast, removeToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      contenido: "",
      recursoActivo: true,
      tagIds: "",
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      loadNote();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadNote = async () => {
    try {
      const note = await getNote(Number(id));
      setValue("nombre", note.nombre);
      setValue("contenido", note.contenido ?? "");
      setValue("recursoActivo", note.recursoActivo);
    } catch (error) {
      showToast("Failed to load note", "error");
      navigate("/notes");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && id) {
        await updateNote(Number(id), data);
        showToast("Note updated successfully", "success");
      } else {
        console.log(data, "data to submit");
        await createNote(data);
        showToast("Note created successfully", "success");
      }
      navigate("/notes");
    } catch (error) {
      showToast(
        isEdit ? "Failed to update note" : "Failed to create note",
        "error"
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/notes")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? "Edit Note" : "Create Note"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update your note details"
                : "Fill in the details to create a new note"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name <span className="text-red-600">*</span>
            </label>
            <input
              {...register("nombre")}
              type="text"
              id="nombre"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter note name"
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contenido"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              {...register("contenido")}
              id="contenido"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Enter note content"
            />
            {errors.contenido && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contenido.message}
              </p>
            )}
          </div>

          {isEdit && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("recursoActivo")}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active resource
                </span>
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : isEdit ? "Update Note" : "Create Note"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/notes")}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
};
