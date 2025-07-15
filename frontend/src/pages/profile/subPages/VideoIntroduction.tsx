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
import { useAddVideoIndroductionMutation } from "@/services/slices/jobSeekerSlice";
import { useApiCaller } from "@/hooks/useApicaller";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";


type VideoIntroduction = {
  title: string;
};

const VideoIntroduction = () => {
  const form = useForm<VideoIntroduction>({
    resolver: yupResolver(VideoSchema),
    defaultValues: {
      title: '',
    },
  });

  const [embedUrl, setEmbedUrl] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const {showNotification}  = useToast();
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddVideoIndroductionMutation);


  const extractSrcFromIframe = (iframeString: string): string | null => {
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  const onSubmit = async (data: VideoIntroduction) => {
    const src = extractSrcFromIframe(data.title);
    setEmbedUrl(src);
    try {  

      const payload = {
        video_url:src || ''
      };



     if(data) {

      const response = await executeApiCall(payload)

      console.log(response)

    

      

     }



    } catch (error) {
      showNotification({ message: 'Failed to save certification', type: "danger" });
      console.error('Failed to save certification:', error);
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
    form.reset({ title: '' });
  };

  const isValidIframe = !!extractSrcFromIframe(form.watch('title'));

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Video Introduction" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 space-y-[30px]">
            <TextAreaField
              fieldName={`title`}
              languageName=""
              isError={!!form.formState.errors?.title}
              lableName="Youtube embedded iframe"
              required={true}
              placeholder="Paste YouTube embed iframe here"
              maxLength={350}
              fieldHeight={'h-[300px]'}
              description={true}
              descriptionText="Paste the full YouTube embed iframe code."
              showLetterCount
            />

{form.watch('title') && !isValidIframe && (
        <div className="text-red-500 mt-4">Invalid YouTube embed iframe. Please check your input.</div>
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
              title={"Save Video"}
              className="w-[155px] disabled:bg-[#78acda] mt-[30px] h-[48px] bg-[#0389FF] text-white rounded-[30px]"
              disabled={isSubmitting}
            >
             {(isSubmitting) ? <LoadingSpinner/> : " Save Video"}
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
