import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { TagSelector } from "../components/TagSelector";
import { useEvents } from "../hooks/useEvents";
import { useTags } from "../hooks/useTags";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import { Save, ArrowLeft } from "lucide-react";
import dayjs from "dayjs";

const schema = yup.object({
  nombre: yup
    .string()
    .required("Nombre is required")
    .min(3, "Nombre must be at least 3 characters"),
  contenido: yup.string().notRequired(),
  fechaCreacion: yup.string().required("Fecha de creación is required"),
  fechaDeEvento: yup
    .string()
    .notRequired()
    .test(
      "end-after-start",
      "End date/time must be after start date/time",
      function (value) {
        const { startAt } = this.parent;
        if (!value || !startAt) return true;
        return dayjs(value).isAfter(dayjs(startAt));
      }
    ),
  taglist: yup.string().notRequired(),
  recursoActivo: yup.boolean().notRequired(),
});

type FormData = {
  nombre: string;
  contenido?: string;
  fechaCreacion: string;
  fechaDeEvento?: string;
  taglist?: string;
  recursoActivo?: boolean;
};

export const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { getEvent, createEvent, updateEvent, loading } = useEvents();
  const { tags } = useTags();
  const { toasts, showToast, removeToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {},
  });

  const taglistValue = watch("taglist");

  useEffect(() => {
    if (isEdit && id) {
      loadEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEvent = async () => {
    try {
      const event = await getEvent(Number(id));
      setValue("nombre", event.nombre);
      setValue("contenido", event.contenido || "");
      setValue(
        "fechaCreacion",
        dayjs(event.fechaCreacion).format("YYYY-MM-DDTHH:mm")
      );
      if (event.fechaDeEvento) {
        setValue(
          "fechaDeEvento",
          dayjs(event.fechaDeEvento).format("YYYY-MM-DDTHH:mm")
        );
      }
      if (event.taglist) {
        setValue("taglist", event.taglist);
      } else if (
        event.tagList &&
        Array.isArray(event.tagList) &&
        event.tagList.length > 0
      ) {
        setValue("taglist", event.tagList.map((tag: any) => tag.id).join(","));
      }
    } catch (error) {
      showToast("Failed to load event", "error");
      navigate("/events");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        nombre: data.nombre,
        contenido: data.contenido || undefined,
        fechaCreacion: dayjs(data.fechaCreacion).toISOString(),
        fechaDeEvento: data.fechaDeEvento
          ? dayjs(data.fechaDeEvento).toISOString()
          : undefined,
        taglist: data.taglist || undefined,
        recursoActivo: data.recursoActivo || true,
      } as any;

      if (isEdit && id) {
        await updateEvent(Number(id), payload);
        showToast("Event updated successfully", "success");
      } else {
        await createEvent(payload);
        showToast("Event created successfully", "success");
      }
      navigate("/events");
    } catch (error) {
      showToast(
        isEdit ? "Failed to update event" : "Failed to create event",
        "error"
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/events")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEdit ? "Edit Event" : "Create Event"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update your event details"
                : "Fill in the details to create a new event"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              {...register("nombre")}
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter event title"
            />
            {errors.nombre && (
              <p className="text-red-600 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              {...register("contenido")}
              id="description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Enter event description"
            />
            {errors.contenido && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contenido.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startAt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date/Time <span className="text-red-600">*</span>
              </label>
              <input
                {...register("fechaCreacion")}
                type="datetime-local"
                id="fechaCreacion"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.fechaCreacion && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.fechaCreacion.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="endAt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date/Time
              </label>
              <input
                {...register("fechaDeEvento")}
                type="datetime-local"
                id="endAt"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.fechaDeEvento && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.fechaDeEvento.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <TagSelector
              tags={tags}
              selectedTagIds={
                taglistValue
                  ? taglistValue
                      .split(",")
                      .map((id) => parseInt(id.trim()))
                      .filter((id) => !isNaN(id))
                  : []
              }
              onChange={(ids) => setValue("taglist", ids.join(","))}
              error={errors.taglist?.message}
            />
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
              {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/events")}
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
