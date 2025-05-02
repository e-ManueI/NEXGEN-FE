"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MndaProps {
  isTermsChecked: boolean;
  setIsTermsChecked: (checked: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

export function Mnda({
  isTermsChecked,
  setIsTermsChecked,
  errorMessage,
  setErrorMessage,
}: MndaProps) {
  return (
    <div className="">
      <div className="prose prose-sm max-w-none rounded-xl bg-white p-6 shadow-sm">
        <p>
          Lorem ipsum dolor sit amet consectetur. Nisl scelerisque sit volutpat
          consectetur mattis mauris ac risus. Ipsum eleifend leo proin felis
          gravida suspendisse massa placerat. Praesent iaculis nunc phasellus
          nam. Facilisi neque est ultricies mauris integer volutpat. Vel
          vestibulum mi vehicula risus et. Gravida gravida dolor pellentesque
          dui vulputate volutpat ut pulvinar egestas. Massa massa sit malesuada
          nibh. Massa sem amet sed nisl. Odio sit etiam a risus molestie
          suspendisse pharetra leo.
        </p>
        <p>
          Varius in orci sed tristique quis maecenas. Sapien nunc ut posuere
          felis. Risus dui curabitur fermentum sed. Egestas duis nunc lobortis
          id. Est massa at venenatis vel integer turpis augue tellus in. Varius
          sit morbi sit augue vel faucibus elementum. Fermentum amet aliquet
          risus vehicula purus adipiscing. Diam vitae viverra ut turpis eu metus
          lacinia tincidunt. Diam facilisis nisi dignissim ultrices vitae at sit
          magna velit. Leo cursus consectetur massa vel. Pharetra imperdiet
          neque ac egestas urna.
        </p>
        <p>
          Eget porta eros porta elit aliquet egestas at justo. Gravida risus
          congue cum malesuada sed netus. Commodo lorem nulla amet quam.
          Fringilla nisl etiam tellus enim nisl porttitor porta. Ut vel
          porttitor a semper a vestibulum nunc dui orci. Ultrices nibh ut
          viverra ut suspendisse egestas suscipit sed. Tellus faucibus eget
          aliquam elementum. Varius duis leo quis lobortis gravida nunc.Ea sint
          qui fugiat nisi. Sunt ipsum sit dolore ipsum occaecat magna. Et nisi
          sunt dolore exercitation. Sit tempor veniam pariatur nulla ipsum esse
          ea irure ut proident pariatur et qui. Laborum commodo exercitation
          consequat elit in irure cupidatat ad exercitation aliqua et. Cupidatat
          dolor consequat reprehenderit cupidatat sint nisi dolore deserunt do
          id elit ullamco tempor. Excepteur officia sint dolor est irure
          voluptate mollit anim aliquip commodo incididunt eu. In voluptate ex
          reprehenderit nisi anim voluptate irure incididunt ea eiusmod
          consectetur veniam. Labore incididunt amet qui irure laboris Lorem
          ipsum non deserunt qui veniam eu. Proident ut elit cupidatat magna.
          Nulla exercitation sint do eu eu. Cupidatat non duis esse velit nisi
          quis sunt veniam in sit in nulla. Voluptate eu sint labore nulla est
          cillum deserunt reprehenderit excepteur exercitation aliquip veniam
          cupidatat nulla. Minim ipsum elit ad ut elit duis veniam. Nostrud
          tempor incididunt consectetur velit occaecat adipisicing irure eiusmod
          ad irure sint ex eu quis. Pariatur aute excepteur id Lorem sit ullamco
          anim minim cupidatat. Deserunt mollit ea ea elit ipsum. Et ad laboris
          cupidatat incididunt est ut veniam occaecat exercitation sunt dolore
          qui ad. Consequat elit duis exercitation cillum ut in. Tempor in et
          sunt minim aliquip consequat cupidatat do id proident ipsum fugiat
          veniam. In officia in amet esse do velit in Lorem laboris. Anim qui
          enim ad sunt qui occaecat veniam culpa sunt. Reprehenderit enim qui
          magna ut tempor. Mollit in ipsum ut aute exercitation ullamco quis eu
          mollit ea aute non. Laborum esse ea sunt mollit ipsum. Amet eiusmod
          enim dolor et. Voluptate quis consectetur ex veniam do nostrud
          deserunt adipisicing eu sunt. Et veniam nisi sint id officia cillum
          veniam anim tempor. Laborum eiusmod nulla tempor ex fugiat nulla irure
          consectetur velit ipsum dolore. Ea nisi cupidatat sint qui aliquip.
          Cillum do cupidatat in sunt veniam commodo sunt cillum cil est eu.
        </p>
      </div>
      <div className="mt-6 flex items-start space-x-4">
        <Checkbox
          id="terms"
          checked={isTermsChecked}
          onCheckedChange={(checked) => {
            setIsTermsChecked(checked as boolean);
            if (checked) {
              setErrorMessage("");
            }
          }}
        />
        <Label htmlFor="terms" className="text-base leading-relaxed sm:text-sm">
          By checking this, you agree to our{" "}
          <a
            href="#"
            className="text-brand-dark whitespace-nowrap hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-brand-dark whitespace-nowrap hover:underline"
          >
            Privacy Policy
          </a>
          .
        </Label>
      </div>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
