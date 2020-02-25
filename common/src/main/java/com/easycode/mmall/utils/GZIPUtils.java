package com.easycode.mmall.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class GZIPUtils {

    /**
     * 使用gzip进行压缩
     */
    public static String compress(String primStr) {
        if (primStr == null || primStr.length() == 0) {
            return primStr;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        GZIPOutputStream gzip = null;
        try {
            gzip = new GZIPOutputStream(out);
            gzip.write(primStr.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (gzip != null) {
                try {
                    gzip.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return new sun.misc.BASE64Encoder().encode(out.toByteArray());
    }

    /**
     * 使用gzip进行解压缩
     */
    public static String uncompress(String compressedStr) {
        if (compressedStr == null) {
            return null;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayInputStream in = null;
        GZIPInputStream ginzip = null;
        byte[] compressed = null;
        String decompressed = null;
        try {
            compressed = new sun.misc.BASE64Decoder().decodeBuffer(compressedStr);
            in = new ByteArrayInputStream(compressed);
            ginzip = new GZIPInputStream(in);

            byte[] buffer = new byte[1024];
            int offset = -1;
            while ((offset = ginzip.read(buffer)) != -1) {
                out.write(buffer, 0, offset);
            }
            decompressed = out.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (ginzip != null) {
                try {
                    ginzip.close();
                } catch (IOException e) {
                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
            try {
                out.close();
            } catch (IOException e) {
            }
        }
        return decompressed;
    }

    public static void main(String[] args) {
        String str = "中文字符串xxxxxxxxxxxxxxxxxxasdasdaasdddddddddddddddddddcccccccccccaasqwe11111111123ddddddddddqqq请问请问群翁请问请问咋所大所多asaadsqqqqqqqqsd";

        String compress = GZIPUtils.compress(str);
        String string = GZIPUtils.uncompress("H4sIAAAAAAAAAO3cTWsTQRzH8fey5yKbxKYPt0IQBCliwYt4GHenyZp9CLuzsUWEHuup4F1QBG/x\n" +
                "JsnBl5NEX4Yzm0myEYT/C/gGCjv/ecjMbD+nH+2r90E00tH4Io5LXVXBedAJjjalgU6D89A2UlVV\n" +
                "T+PgvOOfL1Wm7cDl4u73w8yNLtKifJlUSZHbcrep5G/rPDLJNDFJtS2WWhk9sD92qeN+r3Ny1u2G\n" +
                "9mO7puqZvja2/mjTepEMR7bZdU19o7LWrNN+L+w0s1xHkitTlH7bm4L2e9W3+nmxPdHQbVxXTcew\n" +
                "VLH2h1jdf7bnsAOSzaQsMpd19kaXrf3san5XTTFXYx1vDt0a2qoeDHbPBzc0UUPdfOEkVbnfsHv0\n" +
                "2/rz4+vq/pPd2eph7kbXkyRNVXk7SCqj8sgO6bl1S31dqsj4+b51ZZSp3bnXs2+rxSJwHZkqx/6b\n" +
                "7WuuU+OvpSzeuTuxS1XRqChSv1Llnv1W1j/n6/ndcjFbzb7bGdWkuZqLG/dem/fjK4PIH3bb/qf/\n" +
                "Su/73d24drfV9ku2hzRr9g4KuxFGl7rYXak7S2XqWOfNZQQd9xviP/uu7Tv/9WW5+GjLxl7XqMiU\n" +
                "X6CepIWKn6Rq2FzCtFl8e5vhhyOo7Kl0oQIVqEio9KACFahIqDyGClSgIqFyDBWoQEVCpQ8VqEBF\n" +
                "QuUEKlCBioTKKVSgAhUJlTOoQAUqoggyxApWsCKyQl6PFazIrBDYYwUrMisk9ljBiswKkT1WsCKz\n" +
                "QmaPFazIrBDaYwUrMiuk9ljBiswKsT1WsCKzQm6PFazI/h4yxApWsCKyQm6PFazIrJDbYwUrMivk\n" +
                "9ljBiswKuT1WsCKzQm6PFazIrJDbYwUrMivk9ljBiswKuT1WsCKzQm6PFazI/jlriBWsYEVkhdwe\n" +
                "K1iRWSG3x8r/rbz+C78/mCh4ZQAA");
        System.out.println("解压缩后字符串：" + compress);
        System.out.println("解压缩后字符串：" + string);

    }

}
