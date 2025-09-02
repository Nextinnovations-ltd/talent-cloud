/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import { VideoSchema } from "@/lib/VideoSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useToast from "@/hooks/use-toast";
import { useAddVideoIndroductionMutation, useGetVideoIntroductionQuery } from "@/services/slices/jobSeekerSlice";
import { useApiCaller } from "@/hooks/useApicaller";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {  useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


type VideoIntroduction = {
  title?: string | undefined ;
};

const VideoIntroduction = () => {
  // Runtime check for mutation hook
  if (!useAddVideoIndroductionMutation) {
    // eslint-disable-next-line no-console
    console.error("useAddVideoIndroductionMutation is undefined. Check your import/export and spelling.");
    throw new Error("useAddVideoIndroductionMutation is undefined. Check your import/export and spelling.");
  }

  const form = useForm<VideoIntroduction>({
    //@ts-ignore
    resolver: yupResolver(VideoSchema),
    defaultValues: {
      title: undefined,
    },
  });

  const [embedUrl, setEmbedUrl] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { showNotification } = useToast();
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddVideoIndroductionMutation);
  const { data, isLoading } = useGetVideoIntroductionQuery();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const navigate = useNavigate();

  // Helper to reconstruct iframe from src
  const makeIframeString = (src?: string) =>
    src ? `<iframe src="${src}" width="560" height="315" frameborder="0" allowfullscreen></iframe>` : '';

  const extractSrcFromIframe = (iframeString?: string): string | null => {
    if (!iframeString) return null;
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  // Pre-fill form and preview in edit mode
  React.useEffect(() => {
    if (
      mode === "edit" &&
      !isLoading &&
      data?.data?.video_url
    ) {
      // Only set if not already set (avoid overwriting user edits)
      if (!form.getValues("title")) {
        form.setValue("title", makeIframeString(data.data.video_url));
      }
      setEmbedUrl(data.data.video_url);
    }
  }, [mode, isLoading, data, form]);

  const onSubmit = async (formData: VideoIntroduction) => {
    const src = extractSrcFromIframe(formData.title);
    setEmbedUrl(src);
    try {
      const payload = {
        video_url: src || '',
      };

      if (mode === "edit") {
          await executeApiCall(payload);
      } else {
         await executeApiCall(payload);
      }

      navigate('/user/mainProfile')
     
    } catch (error) {
      showNotification({ message: 'Failed to save video introduction', type: "danger" });
      console.error('Failed to save video introduction:', error);
    }
  };

  const handlePreview = () => {
    const src = extractSrcFromIframe(form.getValues('title'));
    if (src) {
      setEmbedUrl(src);
      setDialogOpen(true);
    }
  };

  const handleClearPreview = () => {
    setEmbedUrl(null);
    setDialogOpen(false);
    form.reset({ title: undefined });
  };

  const isValidIframe = !!extractSrcFromIframe(form.watch('title'));

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Video Introduction" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 space-y-[15px]  h-[400px]">
            <TextAreaField
              fieldName={`title`}
              languageName=""
              isError={!!form.formState.errors?.title}
              lableName="YouTube embedded iframe"
              required={true}
              placeholder="Paste YouTube embedded iframe here"

              fieldHeight={'h-[300px]'}
              description={true}
              descriptionText="Paste the full YouTube embed iframe code."
              showLetterCount
            />
            {form.watch('title') && !isValidIframe && (
              <div className="text-[0.8rem] translate-y-[-6px]  font-medium text-destructive ">Invalid YouTube embedded iframe. Please check your input.</div>
            )}
          </div>
          <div className="max-w-[672px] flex items-center justify-end space-x-4">
            <Button
              type="button"
              onClick={handlePreview}
              className="w-[120px] mt-[30px] h-[48px] bg-white text-black border-2  disabled:opacity-0 border-slate-300 rounded-[30px]"
              disabled={!isValidIframe}
              title="Preview Video"
            >
              Preview
            </Button>
            {(embedUrl || dialogOpen) && (
              <Button
                type="button"
                onClick={handleClearPreview}
                className="w-[100px] mt-[30px] h-[48px] bg-[#e53e3e] text-white rounded-[30px]"
                title="Clear Preview"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              title={mode === "edit" ? "Update Video" : "Save Video"}
              className="w-[155px] disabled:bg-[#78acda] mt-[30px] h-[48px] bg-[#0389FF] text-white rounded-[30px]"
              disabled={isSubmitting}
            >
              {(isSubmitting) ? <LoadingSpinner /> : mode === "edit" ? "Update Video" : "Save Video"}
            </Button>
          </div>
        </form>
      </Form>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {dialogOpen && embedUrl && (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-2xl aspect-video border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-black flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ minHeight: 200, maxHeight: 515 }}
                ></iframe>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VideoIntroduction;
