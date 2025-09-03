const Certifications = () => {
  return (
    <div className="grid grid-cols-2 gap-[35px] mt-[72px]">
    <CertificateCard />
    <CertificateCard />
    <CertificateCard />
    <CertificateCard />

</div>
  )
}

const CertificateCard = ()=> {
    return (
        <div className="w-[490px] ">
        <img height={293} className="w-full rounded-[17px]" src="https://miro.medium.com/v2/resize:fit:4400/1*JsyoB9X03fd6XdilWJmaGQ.png" />

        <div>
            <h3 className="text-[23px] font-semibold mt-[26px] mb-[17px]">
            Google UX Design Professional
            </h3>
            <p className="text-[15px] mb-[12px]">
           Google
            </p>
            <p className="mb-[12px] text-[14px] text-[#6B6B6B]">Credential ID:  UXD123456789  </p>
            <p className="text-[#6B6B6B] text-[14px]">Expiration Date:  Dec 2026</p>
        </div>
    </div>
    )
}

export default Certifications;