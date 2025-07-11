import InputField from "@/components/common/form/fields/input-field";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import { VideoSchema } from "@/lib/VideoSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";


type VideoIntroduction = {
  title?: string;
}

const VideoIntroduction = () => {

  const form = useForm<VideoIntroduction>({
    resolver: yupResolver(VideoSchema),
    defaultValues: {
      title: ''
    }
  });

  const onSubmit = ()=>{}



  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Video Introduction" />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="mb-4 space-y-[30px]">
      <InputField
              fieldName={`organization`}
              languageName=""
              isError={!!form.formState.errors?.title}
              lableName="Youtube embedded link"
              required={true}
              placeholder="Embedded Link"
              maxLength={50}
              showLetterCount
            />
      </div>
      <div className="max-w-[672px] flex items-center justify-end">
            <Button
              type="submit"
              title={"Save Video"}
              className="w-[155px] disabled:bg-[#78acda] mt-[30px] h-[48px] bg-[#0389FF] text-white rounded-[30px]"
              disabled={false}
            >
              Save Video
            </Button>
          </div>
      </form>
      </Form>

    </div>
  )
}

export default VideoIntroduction;
